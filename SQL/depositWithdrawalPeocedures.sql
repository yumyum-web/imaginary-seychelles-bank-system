-- Deposit procedure
CREATE PROCEDURE Deposit (
  IN Acc_id INT,
  IN Amount DECIMAL(10, 2) CHECK (Amount > 0),
  IN Activity_id INT,
) BEGIN;

UPDATE
TABLE Account
SET
  Balance = Balance + Amount
WHERE
  Acc_id = Acc_id;

INSERT INTO
  Transaction (Acc_id, Activity_id, Type)
VALUES
  (Acc_id, Activity_id, 'Deposit');

END;
