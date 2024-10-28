import api from "./api";

const listLoanRequestsAPI = async () => {
  const token = sessionStorage.getItem("token"); // Get the token from storage

  try {
    const response = await api.get("/loan/request/list", {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching loan requests:", error); // Log the error
    throw new Error("Failed to fetch loan requests. Please try again."); // Throw a new error
  }
};

export default listLoanRequestsAPI;
