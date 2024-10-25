
CREATE PROCEDURE AddInterest(
    IN accountId INT,
    IN interestRate DECIMAL(5, 2)
    IN i_activity_id INT
)
BEGIN
    DECLARE currentBalance DECIMAL(10, 2);
    DECLARE interestAmount DECIMAL(10, 2);

    -- Get the current balance of the account
    SELECT balance INTO currentBalance
    FROM Accounts
    WHERE id = accountId;

    -- Calculate the interest
    SET interestAmount = currentBalance * interestRate / 100;

    -- Update the account balance with the new balance
    CALL Deposit(accountId, interestAmount, i_activity_id);

END;



