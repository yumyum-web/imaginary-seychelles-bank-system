DELIMITER //
CREATE PROCEDURE Create_Savings_Account(
    IN p_CustomerId INT,
    IN p_BranchId INT,
    IN p_Balance DECIMAL(10, 2),
    IN p_SA_plan_id INT
)
BEGIN
    -- Insert into Account table
    INSERT INTO Account (Branch_id, Customer_id, Type, Balance, Opened_date)
    VALUES (p_BranchId, p_CustomerId, 'Savings', p_Balance, NOW());

    -- Get the last inserted Acc_id
    SET @acc_id = LAST_INSERT_ID();

    -- Insert into Savings_Account table
    INSERT INTO Savings_Account (Acc_id, SA_plan_id, No_of_withdrawals)
    VALUES (@acc_id, p_SA_plan_id, 0);
END;
//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE Create_Checking_Account(
    IN p_CustomerId INT,
    IN p_BranchId INT,
    IN p_Balance DECIMAL(10, 2)
)
BEGIN
    -- Insert into Account table
    INSERT INTO Account (Branch_id, Customer_id, Type, Balance, Opened_date)
    VALUES (p_BranchId, p_CustomerId, 'Checking', p_Balance, NOW());
END;
//
DELIMITER ;

DELIMITER //

CREATE PROCEDURE Create_Fixed_Deposit(
    IN p_CustomerId INT,
    IN p_BranchId INT,
    IN p_Balance DECIMAL(10, 2),
    IN p_FD_plan_id INT -- Reference to the FD plan
)
BEGIN
    DECLARE savings_account_count INT DEFAULT 0;
    
    DECLARE newFDId INT;

    

    -- Check if the customer has a savings account
    SELECT COUNT(*) INTO savings_account_count
    FROM Account
    WHERE Customer_id = p_CustomerId
      AND Account_type = 'Savings';  -- Assuming you have a 'Status' field indicating if the account is active

    -- If the customer has no active savings account, raise an error
    IF savings_account_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer must have an active savings account before creating a fixed deposit.';
    ELSE
        -- Manually generate the new FD ID
        SELECT IFNULL(MAX(FD_id), 0) + 1 INTO newFDId
        FROM Fixed_deposit;
        -- Insert into Fixed_Deposit table if validation passes
        INSERT INTO Fixed_Deposit (FD_id,Customer_id, Branch_id, Amount, Opened_date, FD_plan_id)
        VALUES (newFDId,p_CustomerId, p_BranchId, p_Balance, NOW(), p_FD_plan_id);
    END IF;
END //

DELIMITER ;

