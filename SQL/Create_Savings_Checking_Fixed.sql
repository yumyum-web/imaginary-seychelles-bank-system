CREATE PROCEDURE Create_Savings_Account (
  IN p_CustomerId INT,
  IN p_BranchId INT,
  IN p_Balance DECIMAL(10, 2),
  IN p_SA_plan_id INT
) BEGIN
-- Insert into Account table
INSERT INTO
  Account (
    Branch_id,
    Customer_id,
    Type,
    Balance,
    Opened_date
  )
VALUES
  (
    p_BranchId,
    p_CustomerId,
    'Savings',
    p_Balance,
    NOW()
  );

-- Get the last inserted Acc_id
SET
  @acc_id = LAST_INSERT_ID();

-- Insert into Savings_Account table
INSERT INTO
  Savings_Account (Acc_id, SA_plan_id, No_of_withdrawals)
VALUES
  (@acc_id, p_SA_plan_id, 0);

END;

CREATE PROCEDURE Create_Checking_Account (
  IN p_CustomerId INT,
  IN p_BranchId INT,
  IN p_Balance DECIMAL(10, 2)
) BEGIN
-- Insert into Account table
INSERT INTO
  Account (
    Branch_id,
    Customer_id,
    Type,
    Balance,
    Opened_date
  )
VALUES
  (
    p_BranchId,
    p_CustomerId,
    'Checking',
    p_Balance,
    NOW()
  );

END;

CREATE PROCEDURE Create_Fixed_Deposit (
  IN p_CustomerId INT,
  IN p_BranchId INT,
  IN p_Balance DECIMAL(10, 2),
  IN p_Account_ID INT, -- The ID of the savings account
  IN p_FD_plan_id INT -- Reference to the FD plan
) BEGIN DECLARE savings_account_id INT DEFAULT NULL;

-- To store the valid Savings_acc_id
-- Check if the customer has the specified savings account
SELECT
  Acc_id INTO savings_account_id
FROM
  Account
WHERE
  Acc_id = p_Account_ID
  AND Customer_id = p_CustomerId
  AND Type = 'Savings';

-- Assuming the savings account type is 'Savings'
-- If no valid savings account is found, raise an error
IF savings_account_id IS NULL THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'No valid savings account found for this customer.';

ELSE
-- Insert into Fixed_Deposit table if validation passes
INSERT INTO
  Fixed_deposit (
    Branch_id,
    Customer_id,
    Balance,
    Savings_acc_id,
    Opened_date,
    FD_plan_id
  )
VALUES
  (
    p_BranchId,
    p_CustomerId,
    p_Balance,
    p_Account_ID,
    NOW(),
    p_FD_plan_id
  );

END IF;

END;
