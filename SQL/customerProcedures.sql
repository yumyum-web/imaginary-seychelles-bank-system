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
