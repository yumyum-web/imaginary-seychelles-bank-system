CREATE VIEW Pending_Loan_Installments AS
SELECT
  L.Loan_id,
  L.Customer_id,
  I.Amount AS Installment_Amount,
  I.DATE AS Installment_Due_Date
FROM
  Loan L
  JOIN Loan_Installments I ON L.Loan_id = I.Loan_id
WHERE
  I.Activity_id IS NULL
  AND I.DATE <= ADD_MONTHS (CURDATE(), 1);
