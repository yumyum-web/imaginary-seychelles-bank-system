-- Deposit procedure
CREATE PROCEDURE Deposit (IN Acc_id INT, IN Activity_id INT,) BEGIN;

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
