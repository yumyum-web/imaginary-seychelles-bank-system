import api from "./api";

interface ProcessLoanRequestData {
  requestId: number;
  action: "Accept" | "Reject";
}

const processLoanRequestAPI = async (data: ProcessLoanRequestData) => {
  const token = sessionStorage.getItem("token"); // Get the token from storage

  try {
    const response = await api.post("/loan/request/process", data, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the headers
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error processing loan request:", error); // Log the error
    throw new Error("Failed to process loan request. Please try again."); // Throw a new error
  }
};

export default processLoanRequestAPI;
