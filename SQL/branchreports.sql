CREATE VIEW branch_transaction_report AS
SELECT
  b.Branch_id,
  t.Transaction_id,
  ac.Acc_id,
  t.Type AS Transaction_type,
  a.type AS Activity_type
FROM
  branch b
  LEFT JOIN account ac ON b.Branch_id = ac.Branch_id
  LEFT JOIN transaction t ON ac.Acc_id = t.Acc_id
  LEFT JOIN activity a ON t.Activity_id = a.Activity_id;

CREATE VIEW late_loan_Installment_report AS
SELECT
  l.Loan_id,
  l.Acc_id,
  l.Customer_id,
  l.Type,
  li.Amount
FROM
  loan l
  LEFT JOIN loan_installments li ON l.Loan_id = li.Loan_id
WHERE
  li.Activity_id IS NULL
  AND li.DATE < now();
