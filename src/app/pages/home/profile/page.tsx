"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import checkAccess from "@/app/utils/checkAccess";
import ProfilePage from "@/app/components/profile/Profile";
import LoadSpinner from "@/app/components/common/LoadSpinner";
import { getCandidate } from "@/app/services/candidateServices";
import { getEmployee } from "@/app/services/employeeServices";
import IUser from "@/app/types/user";
import ICandidate from "@/app/types/candidate";
import IEmployee from "@/app/types/employee";
import { useUser } from "@/app/store/UserContext";
import { getUser } from "@/app/services/userServices";

const Page = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<
    (IUser & ICandidate) | (IUser & IEmployee) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const { mail, role, setRole, setMail } = useUser();

  const router = useRouter();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const accessData = await checkAccess();

        if (!accessData.hasAccess) {
          router.push("/pages/login");
        } else {
          setIsAuthenticated(true);
          setRole(accessData.role.toLowerCase());
          setMail(accessData.email);
        }
      } catch (error) {
        console.error("Validation error:", error);
        router.push("/pages/login");
      }
    };

    validateAccess();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!mail) {
        setLoading(false);
        return;
      }

      try {
        if (role === "employee") {
          const thisUser = await getEmployee(mail);
          setUser(thisUser);
        } else if (role === "candidate") {
          const thisUser = await getCandidate(mail);
          setUser(thisUser);
        } else if (role === "admin") {
          const thisUser = await getUser(mail);
          setUser(thisUser);
          console.log("user", thisUser);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, mail]);

  if (!isAuthenticated) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }
  if (loading) {
    return (
      <div>
        <LoadSpinner />
      </div>
    );
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="">
      <div>
        <ProfilePage user={user} />
      </div>
    </div>
  );
};

export default Page;
