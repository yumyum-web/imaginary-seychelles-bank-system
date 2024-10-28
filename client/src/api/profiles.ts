// src/api/profiles.ts
import { Employee, Individual, Organization } from "@/contexts/types";
import api from "./api";

// Helper function to retrieve the JWT token from session storage
function getAuthToken(): string | null {
  return sessionStorage.getItem("token");
}

/**
 * Fetches the user profile.
 * @returns {Promise<Individual>} - The user profile data.
 */
export async function getUserProfile(): Promise<Individual> {
  try {
    const token = getAuthToken();
    const response = await api.get<Individual>("/profile/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve user profile")
    );
  }
}

/**
 * Fetches the organization profile.
 * @returns {Promise<Organization>} - The organization profile data.
 */
export async function getOrganizationProfile(): Promise<Organization> {
  try {
    const token = getAuthToken();
    const response = await api.get<Organization>("/profile/organization", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve organization profile")
    );
  }
}

/**
 * Fetches the employee profile.
 * @returns {Promise<Employee>} - The employee profile data.
 */
export async function getEmployeeProfile(): Promise<Employee> {
  try {
    const token = getAuthToken();
    const response = await api.get<Employee>("/profile/employee", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw (
      error.response?.data?.message ||
      new Error("Failed to retrieve employee profile")
    );
  }
}
