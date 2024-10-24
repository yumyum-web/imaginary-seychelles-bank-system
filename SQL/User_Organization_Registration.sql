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
