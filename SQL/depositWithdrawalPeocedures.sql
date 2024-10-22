-- Deposit procedure
CREATE PROCEDURE Deposit (
  IN Acc_id INT,
  IN Amount DECIMAL(10, 2) CHECK (Amount > 0.00),
  IN Type ENUM('Online Transfer', 'Loan Deposit')
) BEGIN;

UPDATE
TABLE Account
SET
  Balance = Balance + Amount
WHERE
  Acc_id = Acc_id;

INSERT INTO
  Activity (Type, Amount, DATE)
VALUES
  (Type, Amount, NOW());

END;
