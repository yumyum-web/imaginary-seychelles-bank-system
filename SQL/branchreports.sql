CREATE VIEW Branch_transaction_report AS
SELECT
  b.Branch_id,
  t.Transaction_id,
  ac.Acc_id,
  t.Type AS Transaction_type,
  a.type AS Activity_type,
  a.Amount,
  a.Date
FROM
  Branch b
  LEFT JOIN Account ac ON b.Branch_id = ac.Branch_id
  LEFT JOIN Transaction t ON ac.Acc_id = t.Acc_id
  LEFT JOIN Activity a ON t.Activity_id = a.Activity_id;

CREATE VIEW Late_loan_Installment_report AS
SELECT
  l.Loan_id,
  l.Amount AS Loan_Amount,
  l.Customer_id,
  l.Type,
  l.StartDate,
  l.EndDate,
  ac.Branch_id,
  li.Amount AS Installment_Amount,
  li.DATE AS Due_date
FROM
  Loan l
  JOIN Loan_Installments li ON l.Loan_id = li.Loan_id
  JOIN Account ac ON ac.Acc_id = l.Acc_id
WHERE
  li.Activity_id IS NULL
  AND li.DATE < now();
