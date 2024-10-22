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

INSERT INTO
  Activity (Type, Amount, DATE)
VALUES
  ('Loan Deposit', p_loan_amount, NOW());

SELECT
  LAST_INSERT_ID() INTO v_activity_id;

-- Insert the loan into the Loan table
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

CALL Deposit (p_account_id, p_loan_amount, v_activity_id);

-- Indicate successful creation
SELECT
  'Loan created successfully.' AS Message;

END;

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
  customerId,
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

-- function to calculate the maximum loan amount for self apply loans(online)
CREATE FUNCTION Max_amount_Self_Apply_Loan (p_customer_id INT) RETURNS DECIMAL(10, 2) DETERMINISTIC READS SQL DATA BEGIN DECLARE max_loan_amount DECIMAL(10, 2);

DECLARE fd_balance DECIMAL(10, 2);

-- Get the total balance of all Fixed Deposits for the customer
SELECT
  COALESCE(SUM(Balance), 0) INTO fd_balance
FROM
  Fixed_deposit
WHERE
  Customer_id = p_customer_id;

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

CREATE PROCEDURE Self_Apply_Loan (
  IN p_customer_id INT,
  IN p_loan_type ENUM('Business', 'Personal'),
  IN p_amount DECIMAL(10, 2),
  IN p_purpose VARCHAR(300),
  IN p_time_period INT
) BEGIN DECLARE v_max_loan_amount DECIMAL(10, 2);

DECLARE v_savings_acc_id INT;

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
  FD_id,
  Savings_acc_id INTO v_fd_id,
  v_savings_acc_id
FROM
  Fixed_deposit
WHERE
  Customer_id = p_customer_id
LIMIT
  1;

IF v_fd_id IS NULL THEN SIGNAL SQLSTATE '45000'
SET
  MESSAGE_TEXT = 'Customer does not have a Fixed Deposit.';

END IF;

-- Calculate the maximum loan amount
SET
  v_max_loan_amount = Max_amount_Self_Apply_Loan (p_customer_id);

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
  v_savings_acc_id,
  startDate,
  endDate,
  NULL
);

COMMIT;

SELECT
  'Loan application successful.' AS Message;

END;
