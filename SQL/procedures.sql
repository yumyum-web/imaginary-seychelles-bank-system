DELIMITER / /
CREATE PROCEDURE Create_Savings_Account (
  IN p_CustomerId INT,
  IN p_BranchId INT,
  IN p_Balance DECIMAL(10, 2),
  IN p_SA_plan_id INT
) BEGIN DECLARE v_Min_Balance DECIMAL(10, 2);

-- Get the minimum balance required for the specified savings account plan
SELECT
  Min_Balance INTO v_Min_Balance
FROM
  SA_plan
WHERE
  SA_plan_id = p_SA_plan_id;

-- If the specified savings account plan ID is invalid, raise an error
IF v_Min_Balance IS NULL THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Invalid savings account plan ID.';

END IF;

-- Check if the initial balance meets the minimum balance requirement
IF p_Balance < v_Min_Balance THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Initial balance does not meet the minimum balance requirement.';

END IF;

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

set @savings_acc_id = LAST_INSERT_ID();

SET @event_name = CONCAT('sa_interest_event_', @sa_acc_id); -- Generates a unique event name
SET @sql = CONCAT('CREATE EVENT IF NOT EXISTS ', @event_name,
                  ' ON SCHEDULE EVERY 30 DAY DO CALL Add_Savings_Interest(', @savings_acc_id, ');');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

END;

/ / DELIMITER / /
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

/ / DELIMITER / /
CREATE PROCEDURE Create_Fixed_Deposit (
  IN p_BranchId INT,
  IN p_Balance DECIMAL(10, 2),
  IN p_Account_ID INT, -- The ID of the savings account
  IN p_FD_plan_id INT -- Reference to the FD plan
) BEGIN DECLARE v_savings_account_id INT DEFAULT NULL;

DECLARE v_customer_id INT DEFAULT NULL;

-- To store the valid Savings_acc_id
-- Check if the customer has the specified savings account
SELECT
  SA.Savings_acc_id,
  A.Customer_id INTO v_savings_account_id,
  v_customer_id
FROM
  Account A
  JOIN Savings_Account SA ON A.Acc_id = SA.Acc_id
WHERE
  A.Acc_id = p_Account_ID;

IF v_savings_account_id IS NULL THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Invalid account ID.';

END IF;

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
    v_customer_id,
    p_Balance,
    v_savings_account_id,
    NOW(),
    p_FD_plan_id
  );

set @fd_id = LAST_INSERT_ID();

SET @event_name = CONCAT('fd_interest_event_', @fd_id); -- Generates a unique event name
SET @sql = CONCAT('CREATE EVENT IF NOT EXISTS ', @event_name,
                  ' ON SCHEDULE EVERY 30 DAY DO CALL Add_FD_Interest(', @fd_id, ');');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

END;

/ / DELIMITER / /
-- Deposit procedure
CREATE PROCEDURE Deposit (
  IN D_acc_id INT,
  IN D_amount DECIMAL(10, 2),
  IN D_activity_id INT
) BEGIN

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

/ / DELIMITER / /
-- Max_Withdraw_Amount Function: Returns the maximum amount that can be withdrawn from an account, null if there is no limit.
CREATE FUNCTION Max_Withdraw_Amount (p_Acc_id INT) RETURNS DECIMAL(10, 2) DETERMINISTIC BEGIN DECLARE Acc_balance DECIMAL(10, 2);

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

/ / delimiter / /
-- Available_Withdrawals: Returns the number of withdrawals that can be made from an account.
CREATE FUNCTION Available_Withdrawals (Acc_id INT) RETURNS INT DETERMINISTIC BEGIN

DECLARE v_No_of_withdrawals INT;

SELECT
  No_of_withdrawals INTO v_No_of_withdrawals
FROM
  Savings_Account
WHERE
  Savings_Account.Acc_id = Acc_id;

IF v_No_of_withdrawals IS NULL THEN
RETURN NULL;

ELSE
RETURN 5 - v_No_of_withdrawals;

END IF;

END;

/ / delimiter / /
-- Withdraw Procedure: Withdraws money from an account.
CREATE PROCEDURE Withdraw (
  IN W_acc_id INT,
  IN W_activity_id INT,
  IN W_amount DECIMAL(10, 2)
) BEGIN

DECLARE Max_amount DECIMAL(10, 2);

DECLARE Available_withdrawals INT;

DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN
    ROLLBACK;
    RESIGNAL ;

END;

START TRANSACTION;

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

UPDATE Savings_Account
SET
  No_of_withdrawals = No_of_withdrawals + 1
WHERE
  Savings_Account.Acc_id = W_acc_id;

INSERT INTO
  Transaction (Acc_id, Activity_id, Type)
VALUES
  (W_acc_id, W_activity_id, 'Withdrawal');

COMMIT;

END;

/ / delimiter / /
CREATE PROCEDURE Create_Loan_Request (
  IN employeeId INT,
  IN loanType ENUM('Business', 'Personal'),
  IN loanAmount DECIMAL(10, 2),
  IN l_purpose VARCHAR(300),
  IN accountId INT,
  IN timePeriod INT
) BEGIN
-- Insert loan request into Loan_Request table
INSERT INTO
  Loan_Request (
    Loan_type,
    Acc_id,
    Amount,
    Purpose,
    Employee_id,
    Status,
    Time_period
  )
VALUES
  (
    loanType,
    accountId,
    loanAmount,
    l_purpose,
    employeeId,
    'Pending',
    timePeriod
  );

END;

/ / delimiter / /
CREATE PROCEDURE Create_Loan (
  IN p_loan_type ENUM('Business', 'Personal'),
  IN p_loan_amount DECIMAL(10, 2),
  IN p_interest_rate DECIMAL(5, 3),
  IN p_purpose VARCHAR(300),
  IN p_customer_id INT,
  IN p_account_id INT,
  IN p_start_date DATE,
  IN p_end_date DATE,
  IN p_request_id INT
) BEGIN DECLARE v_activity_id INT;

DECLARE v_time_period INT;

DECLARE i INT DEFAULT 0;

DECLARE v_installment_amount DECIMAL(10, 2);

-- Error handling
DECLARE EXIT
    HANDLER FOR SQLEXCEPTION BEGIN
    ROLLBACK;

    RESIGNAL;

END;

START TRANSACTION;

-- Calculate the time period in months
SET
  v_time_period = PERIOD_DIFF(
    EXTRACT(
      YEAR_MONTH
      FROM
        p_end_date
    ),
    EXTRACT(
      YEAR_MONTH
      FROM
        p_start_date
    )
  );

-- Insert the loan activity
INSERT INTO
  Activity (Type, Amount, DATE)
VALUES
  ('Loan Deposit', p_loan_amount, NOW());

SET
  v_activity_id = LAST_INSERT_ID();

-- Insert into the Loan table
INSERT INTO
  Loan (
    Type,
    Amount,
    Interest_rate,
    Purpose,
    Request_id,
    Customer_id,
    Acc_id,
    Activity_id,
    StartDate,
    EndDate
  )
VALUES
  (
    p_loan_type,
    p_loan_amount,
    p_interest_rate,
    p_purpose,
    p_request_id,
    p_customer_id,
    p_account_id,
    v_activity_id,
    p_start_date,
    p_end_date
  );

-- Calculate and insert monthly installments

SET
  v_installment_amount = CAST(
    ((p_loan_amount + (p_loan_amount * p_interest_rate)) / v_time_period) AS DECIMAL(10, 2)
  );

WHILE i < v_time_period DO
INSERT INTO
  Loan_Installments (Loan_id, DATE, Amount, Activity_id)
VALUES
  (
    LAST_INSERT_ID(),
    DATE_ADD(p_start_date, INTERVAL i MONTH),
    v_installment_amount,
    NULL
  );

SET
  i = i + 1;

END
WHILE;

-- Update account balance
CALL Deposit (p_account_id, p_loan_amount, v_activity_id);

-- Indicate successful creation
SELECT
  'Loan created successfully.' AS Message;

COMMIT;

END;

/ / delimiter / /
CREATE PROCEDURE Accept_Loan_Request (
  IN managerId INT,
  IN requestId INT,
  IN action ENUM('Accept', 'Reject')
) BEGIN DECLARE requestStatus ENUM('Pending', 'Accepted', 'Rejected');

DECLARE loanAmount DECIMAL(10, 2);

DECLARE accountId INT;

DECLARE customerId INT;

DECLARE loanType ENUM('Business', 'Personal');

DECLARE loanPurpose VARCHAR(100);

DECLARE timePeriod INT;

DECLARE interestRate DECIMAL(5, 3);

DECLARE startDate DATE;

DECLARE endDate DATE;

-- Error handling
DECLARE EXIT
HANDLER FOR SQLEXCEPTION BEGIN
ROLLBACK;

RESIGNAL;

END;

START TRANSACTION;

-- Check if the loan request exists and its status
SELECT
  Status,
  Amount,
  Acc_id,
  Loan_type,
  Purpose,
  Time_period INTO requestStatus,
  loanAmount,
  accountId,
  loanType,
  loanPurpose,
  timePeriod
FROM
  Loan_Request
WHERE
  Request_id = requestId;

IF requestStatus IS NULL THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Loan request not found.';

END IF;

IF requestStatus != 'Pending' THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Loan request has already been processed.';

END IF;

-- get the customer id
SELECT
  Customer_id INTO customerId
FROM
  Account
WHERE
  Acc_id = accountId;

-- Validate manager exists
IF NOT EXISTS (
  SELECT
    1
  FROM
    Employee
  WHERE
    Employee_id = managerId
    AND POSITION = 'Branch Manager'
) THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Invalid manager ID.';

END IF;

-- Process the loan request
IF action = 'Accept' THEN
-- Update loan request to 'Accepted' and assign the manager
UPDATE Loan_Request
SET
  Status = 'Accepted',
  Manager_id = managerId
WHERE
  Request_id = requestId;

-- Interest rate calculation logic based on loan type, amount, and time period
IF loanType = 'Business' THEN IF loanAmount > 50000 THEN
SET
  interestRate = 0.035;

-- 3.5% for large business loans
ELSE
SET
  interestRate = 0.045;

-- 4.5% for smaller business loans
END IF;

ELSEIF loanType = 'Personal' THEN IF timePeriod > 12 THEN
SET
  interestRate = 0.055;

-- 5.5% for longer personal loans (>12 months)
ELSE
SET
  interestRate = 0.05;

-- 5% for shorter personal loans (<=12 months)
END IF;

END IF;

-- Calculate loan startDate (today) and endDate (based on time period)
SET
  startDate = CURDATE();

SET
  endDate = DATE_ADD(CURDATE(), INTERVAL timePeriod MONTH);

-- Call Create_Loan procedure
CALL Create_Loan (
  loanType,
  loanAmount,
  interestRate,
  loanPurpose,
  customerId,
  accountId,
  startDate,
  endDate,
  requestId
);

ELSEIF action = 'Reject' THEN
-- Update loan request to 'Rejected' and assign the manager
UPDATE Loan_Request
SET
  Status = 'Rejected',
  Manager_id = managerId
WHERE
  Request_id = requestId;

ELSE SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Invalid action. Please specify Accept or Reject.';

END IF;

COMMIT;

END;

/ /
-- function to calculate the maximum loan amount for self apply loans(online)
delimiter / /
CREATE FUNCTION Max_amount_Self_Apply_Loan (p_FD_id INT) RETURNS DECIMAL(10, 2) DETERMINISTIC BEGIN DECLARE max_loan_amount DECIMAL(10, 2);

DECLARE fd_balance DECIMAL(10, 2);

-- Get the total balance of all Fixed Deposits for the customer
SELECT
  Balance INTO fd_balance
FROM
  Fixed_deposit
WHERE
  FD_id = p_FD_id;

-- Calculate 60% of the FD balance
SET
  max_loan_amount = fd_balance * 0.60;

-- Apply the upper bound of 500,000
IF max_loan_amount > 500000 THEN
SET
  max_loan_amount = 500000;

END IF;

RETURN max_loan_amount;

END;

/ / delimiter / /
CREATE PROCEDURE Self_Apply_Loan (
  IN p_customer_id INT,
  IN p_FD_id INT,
  IN p_savings_acc_id INT,
  IN p_loan_type ENUM('Business', 'Personal'),
  IN p_amount DECIMAL(10, 2),
  IN p_purpose VARCHAR(300),
  IN p_time_period INT
) BEGIN DECLARE v_max_loan_amount DECIMAL(10, 2);

DECLARE v_fd_id INT;

DECLARE interestRate DECIMAL(5, 3);

DECLARE startDate DATE;

DECLARE endDate DATE;

-- Error handling
DECLARE EXIT
HANDLER FOR SQLEXCEPTION BEGIN
ROLLBACK;

RESIGNAL;

END;

START TRANSACTION;

-- Check if the customer has an FD
SELECT
  FD_id INTO v_fd_id
FROM
  Fixed_deposit
WHERE
  FD_id = p_FD_id
  AND Customer_id = p_customer_id
LIMIT
  1;

IF v_fd_id IS NULL THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Customer does not have a Fixed Deposit.';

END IF;

-- Calculate the maximum loan amount
SET
  v_max_loan_amount = Max_amount_Self_Apply_Loan (p_FD_id);

-- Check if the requested amount is within the allowed limit
IF p_amount > v_max_loan_amount THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Requested loan amount exceeds the maximum allowed.';

END IF;

-- Interest rate calculation logic based on loan type and amount
IF p_loan_type = 'Business' THEN IF p_amount > 50000 THEN
SET
  interestRate = 0.035;

-- 3.5% for large business loans
ELSE
SET
  interestRate = 0.045;

-- 4.5% for smaller business loans
END IF;

ELSEIF p_loan_type = 'Personal' THEN IF p_time_period > 12 THEN
SET
  interestRate = 0.055;

-- 5.5% for longer personal loans
ELSE
SET
  interestRate = 0.05;

-- 5% for shorter personal loans
END IF;

END IF;

-- Calculate loan startDate (today) and endDate (based on time period)
SET
  startDate = CURDATE();

SET
  endDate = DATE_ADD(CURDATE(), INTERVAL p_time_period MONTH);

-- Call Create_Loan procedure
CALL Create_Loan (
  p_loan_type,
  p_amount,
  interestRate,
  p_purpose,
  p_customer_id,
  p_savings_acc_id,
  startDate,
  endDate,
  NULL
);

COMMIT;

SELECT
  'Loan application successful.' AS Message;

END;

/ / delimiter / /
CREATE PROCEDURE User_Registration (
  IN p_NIC VARCHAR(12),
  IN p_FirstName VARCHAR(100),
  IN p_LastName VARCHAR(100),
  IN p_Address VARCHAR(200),
  IN p_PhoneNumber INT,
  IN p_DOB DATETIME,
  IN p_Username VARCHAR(25),
  IN p_Password VARCHAR(25)
) BEGIN
-- Insert into Login table
INSERT INTO
  Login (Username, Password, Password_last_update)
VALUES
  (p_Username, p_Password, NOW());

-- Get the last inserted Login_id
SET
  @login_id = LAST_INSERT_ID();

-- Insert into Customer table for Individual
INSERT INTO
  Customer (Customer_type)
VALUES
  ('Individual');

-- Get the last inserted Customer_id
SET
  @customer_id = LAST_INSERT_ID();

-- Insert into User table
INSERT INTO
  User (
    NIC,
    First_Name,
    Last_Name,
    Address,
    Phone_number,
    Date_of_Birth,
    Login_id,
    Customer_id
  )
VALUES
  (
    p_NIC,
    p_FirstName,
    p_LastName,
    p_Address,
    p_PhoneNumber,
    p_DOB,
    @login_id,
    @customer_id
  );

END;

/ / delimiter / /
CREATE PROCEDURE Organization_Registration (
  IN p_OrgName VARCHAR(100),
  IN p_Type VARCHAR(100),
  IN p_Username VARCHAR(25),
  IN p_Password VARCHAR(25),
  IN p_Address VARCHAR(200),
  IN p_ContactNumber INT,
  IN p_Date_of_incorp DATETIME
) BEGIN
-- Insert into Login table
INSERT INTO
  Login (Username, Password, Password_last_update)
VALUES
  (p_Username, p_Password, NOW());

-- Get the last inserted Login_id
SET
  @login_id = LAST_INSERT_ID();

-- Insert into Customer table for Organization
INSERT INTO
  Customer (Customer_type)
VALUES
  ('Organization');

-- Get the last inserted Customer_id
SET
  @customer_id = LAST_INSERT_ID();

-- Insert into Organization table
INSERT INTO
  Organization (
    Organization_name,
    Type,
    Address,
    Phone_number,
    Date_of_incorporation,
    Login_id,
    Customer_id
  )
VALUES
  (
    p_OrgName,
    p_Type,
    p_Address,
    p_ContactNumber,
    p_Date_of_incorp,
    @login_id,
    @customer_id
  );

END;

/ /
-- Employee withdraws on behalf of a customer
delimiter / /
CREATE PROCEDURE Employee_Withdraw (IN p_acc_id INT, IN p_amount DECIMAL(10, 2)) BEGIN DECLARE EXIT
HANDLER FOR SQLEXCEPTION BEGIN
ROLLBACK;

RESIGNAL;

END;

START TRANSACTION;

INSERT INTO
  Activity (Type, Amount, DATE)
VALUES
  ('Bank Withdrawal', p_amount, NOW());

-- Get the last inserted ID for activity
SET
  @activity_id = LAST_INSERT_ID();

-- Call Withdraw procedure
CALL Withdraw (p_acc_id, @activity_id, p_amount);

COMMIT;

SELECT
  'Withdrawal successful' AS Message;

END;

/ /
-- Employee deposits on behalf of a customer
delimiter / /
CREATE PROCEDURE Employee_Deposit (IN p_acc_id INT, IN p_amount DECIMAL(10, 2)) BEGIN DECLARE EXIT
HANDLER FOR SQLEXCEPTION BEGIN
ROLLBACK;

RESIGNAL;

END;

START TRANSACTION;

INSERT INTO
  Activity (Type, Amount, DATE)
VALUES
  ('Bank Deposit', p_amount, NOW());

-- Get the last inserted ID for activity
SET
  @activity_id = LAST_INSERT_ID();

-- Call Deposit procedure
CALL Deposit (p_acc_id, p_amount, @activity_id);

COMMIT;

END;

/ / delimiter / /
CREATE PROCEDURE Online_Transfer (
  IN p_customer_id INT,
  IN p_from_acc_id INT,
  IN p_to_acc_id INT,
  IN p_amount DECIMAL(10, 2)
) BEGIN DECLARE EXIT
HANDLER FOR SQLEXCEPTION BEGIN
ROLLBACK;

RESIGNAL;

END;

START TRANSACTION;

-- check if the customer is the owner of the from account
IF NOT EXISTS (
  SELECT
    1
  FROM
    Account
  WHERE
    Customer_id = p_customer_id
    AND Acc_id = p_from_acc_id
) THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'You are not the owner of the account';

END IF;

INSERT INTO
  Activity (Type, Amount, DATE)
VALUES
  ('Online Transfer', p_amount, NOW());

SET
  @activity_id = LAST_INSERT_ID();

CALL Withdraw (p_from_acc_id, @activity_id, p_amount);

CALL Deposit (p_to_acc_id, p_amount, @activity_id);

COMMIT;

END;

/ / delimiter / /
CREATE PROCEDURE Add_Savings_Interest (
  IN p_Savings_acc_id INT
) BEGIN
    -- Update Savings Account with FD interest for the specified account
    UPDATE Savings_Account SA
        JOIN Account A ON SA.Acc_id = A.Acc_id
        JOIN SA_plan SAP ON SA.SA_plan_id = SAP.SA_plan_id
    SET A.Balance = A.Balance + (A.Balance * SAP.Interest_rate / 12)
    WHERE A.Balance > 0
      AND SA.Savings_acc_id = p_Savings_acc_id; -- Update only for the specified savings account
END;

//

DELIMITER //

CREATE PROCEDURE Add_FD_Interest(IN p_FD_id INT)
BEGIN
  -- Update Savings Account with FD interest for the specified account
  UPDATE Savings_Account SA
  JOIN Fixed_deposit FD ON SA.Savings_acc_id = FD.Savings_acc_id
  JOIN Account A ON SA.Acc_id = A.Acc_id
  JOIN FD_plan FDP ON FD.FD_plan_id = FDP.FD_plan_id
  SET A.Balance = A.Balance + (FD.Balance * FDP.Interest_rate / 12)
  WHERE FD.Balance > 0
    AND FD.FD_id = p_FD_id;  -- Update only for the specified savings account
END;

//



