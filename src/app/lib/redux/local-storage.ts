import { initialSettings } from "./settingsSlice";
import type { RootState } from "./store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "open-resume-state";

export const loadStateFromLocalStorage = () => {
  try {
    const stringifiedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stringifiedState) {
      return {
        resume: null,
        settings: initialSettings,
      };
    }
    return JSON.parse(stringifiedState);
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const stringifiedState = JSON.stringify(state);
    console.log("data for saving: ", LOCAL_STORAGE_KEY, stringifiedState);   
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
    const result= localStorage.getItem(LOCAL_STORAGE_KEY);
    console.log(result);
  } catch (e) {
    console.error("Failed to load state from localStorage:", e);
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
