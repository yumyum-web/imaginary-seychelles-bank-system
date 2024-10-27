import { Handler } from "openapi-backend";
import conn from "../../helpers/db.js";
import { RowDataPacket } from "mysql2";
interface LoanDetailsRequest {
  loanId: number;
  customerId: number;
}

const details: Handler<LoanDetailsRequest> = async (c, _, res) => {
  const { loanId, customerId } = c.request.query;

  try {
    // Retrieve loan details from the database
    const [rows] = await conn.execute(
      "SELECT * FROM Loans WHERE loan_id = ? AND customer_id = ?",
      [loanId, customerId],
    );

    const loanRows = rows as RowDataPacket[];

    // Check if loanRows is empty
    if (loanRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Loan not found or unauthorized access." });
    }

    // Assuming loan details are in the first row
    const loanDetails = loanRows[0];
    // Send the loan details as a JSON response
    return res.status(200).json({
      loanId: loanDetails.loan_id,
      loanType: loanDetails.loan_type,
      amount: loanDetails.amount,
      purpose: loanDetails.purpose,
      interestRate: loanDetails.interest_rate,
      startDate: loanDetails.start_date,
      endDate: loanDetails.end_date,
      status: loanDetails.status,
      timePeriod: loanDetails.time_period,
    });
  } catch (error) {
    console.error("Failed to retrieve loan details:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve loan details." });
  }
};

export default details;
