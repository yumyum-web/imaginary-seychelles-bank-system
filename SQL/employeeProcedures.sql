-- Employee withdraws on behalf of a customer
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

-- Employee deposits on behalf of a customer
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
