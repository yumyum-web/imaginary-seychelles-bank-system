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

-- Max_Withdraw_Amount Function: Returns the maximum amount that can be withdrawn from an account, null if there is no limit.
CREATE FUNCTION Max_Withdraw_Amount (Acc_id INT) RETURNS DECIMAL(10, 2) BEGIN;

DECLARE Aax_amount DECIMAL(10, 2);

DECLARE Acc_type ENUM('Savings', 'Checking');

DECLARE Acc_balance DECIMAL(10, 2);

DECLARE Min_balance
SELECT
  Type,
  Balance INTO Acc_type,
  Acc_balance
FROM
  Account
WHERE
  Acc_id = Acc_id;

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
      Acc_id = Acc_id
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

IF No_of_withdrawals = NULL THEN
RETURN NULL;

ELSE
RETURN 5 - No_of_withdrawals;

END IF;

END;
