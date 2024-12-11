"use client";
import React, { useState } from "react";
import IJob from "../types/job";
import JobCard from "./JobCard";
import CandidateJobCard from "./CandidateJobCard";
import { useUser } from "../store/UserContext";
import JobEmployeePopUp from "./JobEmployeePopUp";
import EditJobForm from "./EditJobForm ";
import { getJobApplications } from "../services/applicationServices";
import IApplication from "../types/application";
import { JobActionsProvider, useJobActions } from "../store/JobActionsContext";
import { updateJob } from "../services/jobServices";

interface JobListProps {
  jobs: IJob[]; // Accept jobs as a prop
}

const JobList: React.FC<JobListProps> = ({ jobs: initialJobs }) => {
  const { role } = useUser();
  const [jobs, setJobs] = useState<IJob[]>(initialJobs); // Local state for jobs
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [jobApplications, setJobApplications] = useState<IApplication[]>([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isEditPopUpOpen, setIsEditPopUpOpen] = useState(false); // Track if the edit pop-up is open

  const { handleSendJob } = useJobActions();

  const handleEditJob = (job: IJob) => {
    setSelectedJob(job); // Set the selected job
    setIsEditPopUpOpen(true); // Open the edit popup
  };

  const handleOpenPopUp = async (job: IJob) => {
    setSelectedJob(job); // Set the selected job
    try {
      // Fetch applications for the selected job
      const applications = await getJobApplications(job._id);
      setJobApplications(applications); // Set applications
    } catch (error) {
      console.error("Failed to fetch job applications:", error);
    } finally {
      setIsPopUpOpen(true); // Open the popup
    }
  };

  const handleClosePopUp = () => {
    setSelectedJob(null);
    setJobApplications([]);
    setIsPopUpOpen(false);
    setIsEditPopUpOpen(false); // Close the edit popup
  };

  const handleJobUpdate = async (updatedJob: IJob) => {
    try {
      const updated = await updateJob(updatedJob); // Call the server to update the job
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updated._id ? updated : job)) // Update the local state
      );
    } catch (error) {
      console.error("Failed to update the job:", error);
    } finally {
      setIsEditPopUpOpen(false); // Close the edit pop-up after submission
    }
  };

  if (!jobs || jobs.length === 0) {
    return <div>No jobs available</div>;
  }

  return (
    <JobActionsProvider>
      <div className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {jobs.map((job) =>
            role === "employee" ? (
              <div key={job._id}>
                <JobCard job={job} />
                <button
                  onClick={() => handleOpenPopUp(job)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Applications
                </button>
                <button onClick={() => handleEditJob(job)}>Edit</button>
              </div>
            ) : (
              <CandidateJobCard key={job._id} job={job} />
            )
          )}
        </div>

        {/* Render the application popup */}
        {role === "employee" && isPopUpOpen && selectedJob && (
          <JobEmployeePopUp
            job={selectedJob}
            applications={jobApplications} // Pass the fetched applications
            onClose={handleClosePopUp}
            onUpdateStatus={(applicationId) => {
              console.log(`Updated application ${applicationId}`);
              handleSendJob(applicationId);
            }}
          />
        )}

        {/* Render the edit job popup */}
        {role === "employee" && isEditPopUpOpen && selectedJob && (
          <EditJobForm
            job={selectedJob}
            onClose={handleClosePopUp}
            onUpdate={handleJobUpdate}
          />
        )}
      </div>
    </JobActionsProvider>
  );
};

export default JobList;
