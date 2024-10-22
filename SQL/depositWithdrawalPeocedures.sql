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

-- Max_Withdraw_Amount Function: Returns the maximum amount that can be withdrawn from an account, null if there is no limit.
CREATE FUNCTION Max_Withdraw_Amount (Acc_id INT) RETURNS DECIMAL(10, 2) BEGIN DECLARE Max_amount DECIMAL(10, 2);

DECLARE Acc_type ENUM('Savings', 'Checking');

DECLARE Acc_balance DECIMAL(10, 2);

DECLARE Min_balance DECIMAL(10, 2);

SELECT
  Type,
  Balance INTO Acc_type,
  Acc_balance
FROM
  Account
WHERE
  Account.Acc_id = Acc_id;

IF Acc_type = 'Savings' THEN
SELECT
  Min_balance INTO Min_balance
FROM
  SA_plan
WHERE
  SA_plan_id = (
    SELECT
      SA_plan_id
    FROM
      Savings_Account
    WHERE
      Savings_Account.Acc_id = Acc_id
  );

IF Acc_balance > Min_balance THEN
RETURN Acc_balance - Min_balance;

ELSE
RETURN 0.00;

END IF;

ELSE
RETURN Acc_balance;

END IF;

END;

-- Available_Withdrawals: Returns the number of withdrawals that can be made from an account.
CREATE FUNCTION Available_Withdrawals (Acc_id INT) RETURNS INT BEGIN;

DECLARE No_of_withdrawals INT;

SELECT
  No_of_withdrawals INTO No_of_withdrawals
FROM
  Savings_Account
WHERE
  Acc_id = Acc_id;

IF No_of_withdrawals IS NULL THEN
RETURN NULL;

ELSE
RETURN 5 - No_of_withdrawals;

END IF;

END;

-- Withdraw Procedure: Withdraws money from an account.
CREATE PROCEDURE Withdraw (
  IN Acc_id INT,
  IN Activity_id INT,
  IN Amount DECIMAL(10, 2) CHECK (Amount > 0.00),
  IN Type ENUM('Online Transfer', 'Loan Installment')
) BEGIN;

DECLARE Max_amount DECIMAL(10, 2);

DECLARE Available_withdrawals INT;

SET
  Max_amount = Max_Withdraw_Amount (Acc_id);

SET
  Available_withdrawals = Available_Withdrawals (Acc_id);

IF Amount > Max_amount THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Amount exceeds the maximum withdrawal limit.';

END IF;

IF Available_withdrawals = 0 THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'No more withdrawals allowed.';

END IF;

UPDATE Account
SET
  Balance = Balance - Amount
WHERE
  Account.Acc_id = Acc_id;

INSERT INTO
  Transaction (Acc_id, Activity_id, Type)
VALUES
  (Acc_id, Activity_id, 'Withdrawal');

END;
