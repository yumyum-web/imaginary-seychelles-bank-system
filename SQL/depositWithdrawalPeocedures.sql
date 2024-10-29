-- Deposit procedure
CREATE PROCEDURE Deposit (
  IN D_acc_id INT,
  IN D_amount DECIMAL(10, 2),
  IN D_activity_id INT
) BEGIN;

UPDATE Account
SET
  Balance = Balance + D_amount
WHERE
  Account.Acc_id = D_acc_id;

INSERT INTO
  Transaction (Acc_id, Activity_id, Type)
VALUES
  (D_acc_id, D_activity_id, 'Deposit');

END;

-- Max_Withdraw_Amount Function: Returns the maximum amount that can be withdrawn from an account, null if there is no limit.
CREATE FUNCTION Max_Withdraw_Amount (p_Acc_id INT) RETURNS DECIMAL(10, 2) BEGIN DECLARE Acc_balance DECIMAL(10, 2);

DECLARE Min_balance DECIMAL(10, 2);

SELECT
  Balance,
  Min_balance INTO Acc_balance,
  Min_balance
FROM
  Account A
  LEFT JOIN Savings_Account S ON A.Acc_id = S.Acc_id
  LEFT JOIN SA_plan Sp ON S.SA_plan_id = Sp.SA_plan_id
WHERE
  A.Acc_id = p_Acc_id;

IF Min_balance IS NULL THEN
RETURN Acc_balance;

END IF;

IF Acc_balance > Min_balance THEN
RETURN Acc_balance - Min_balance;

ELSE
RETURN 0.00;

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
  Savings_Account.Acc_id = Acc_id;

IF No_of_withdrawals IS NULL THEN
RETURN NULL;

ELSE
RETURN 5 - No_of_withdrawals;

END IF;

END;

-- Withdraw Procedure: Withdraws money from an account.
CREATE PROCEDURE Withdraw (
  IN W_acc_id INT,
  IN W_activity_id INT,
  IN W_amount DECIMAL(10, 2)
) BEGIN;

DECLARE Max_amount DECIMAL(10, 2);

DECLARE Available_withdrawals INT;

SET
  Max_amount = Max_Withdraw_Amount (W_acc_id);

SET
  Available_withdrawals = Available_Withdrawals (W_acc_id);

IF W_amount > Max_amount THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Amount exceeds the maximum withdrawal limit.';

END IF;

IF Available_withdrawals = 0 THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'No more withdrawals allowed.';

END IF;

UPDATE Account
SET
  Balance = Balance - W_amount
WHERE
  Account.Acc_id = W_acc_id;

INSERT INTO
  Transaction (Acc_id, Activity_id, Type)
VALUES
  (W_acc_id, W_activity_id, 'Withdrawal');

END;
