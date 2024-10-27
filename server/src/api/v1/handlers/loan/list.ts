import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";

interface LoanRequest extends RowDataPacket {
  requestId: number;
  employeeId: number;
  loanType: string;
  loanAmount: number;
  purpose: string;
  status: string;
  timePeriod: number;
  createdAt: string; // Or Date, depending on how you want to handle it
}

const list: Handler = async (c, _, res) => {
  try {
    // Query to get all loan requests
    const [rows] = await conn.execute<LoanRequest[]>(
      "SELECT * FROM LoanRequests",
    );

    // Check if there are any loan requests
    if (rows.length === 0) {
      return res.status(404).json({ message: "No loan requests found." });
    }

    // Send the loan requests as a response
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Failed to retrieve loan requests:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve loan requests." });
  }
};

export default list;
