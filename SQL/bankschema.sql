----------------------------------------
--                                    --
--             Tables                 --
--                                    --
----------------------------------------
-- Branch table
CREATE TABLE Branch (
  Branch_id INT PRIMARY KEY,
  Name VARCHAR(100),
  Address VARCHAR(300)
);

-- Customer table
CREATE TABLE Customer (
  Customer_id INT PRIMARY KEY,
  Customer_type ENUM('Individual', 'Organization')
);

-- Login table
CREATE TABLE Login (
  Login_id INT PRIMARY KEY,
  Username VARCHAR(25),
  Password VARCHAR(25),
  Password_last_update DATETIME
);

-- User Table
CREATE TABLE User (
  NIC VARCHAR(12) PRIMARY KEY,
  First_Name VARCHAR(100),
  Last_Name VARCHAR(100),
  Address VARCHAR(200),
  Phone_number INT,
  Date_of_Birth DATETIME,
  Login_id INT,
  Customer_id INT,
  FOREIGN KEY (Login_id) REFERENCES Login (Login_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id)
);

-- Account table
CREATE TABLE Account (
  Acc_id INT PRIMARY KEY,
  Branch_id INT,
  Customer_id INT,
  Type ENUM('Savings', 'Checking'),
  Balance DECIMAL(10, 2) CHECK (Balance > 0.00),
  Opened_date DATETIME,
  FOREIGN KEY (Branch_id) REFERENCES Branch (Branch_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id)
);

-- SA_plan table
CREATE TABLE SA_plan (
  SA_plan_id INT PRIMARY KEY,
  Name VARCHAR(30),
  Interest_rate DECIMAL(4, 3) CHECK (Interest_rate BETWEEN 0 AND 1),
  Min_balance DECIMAL(10, 2) CHECK (Min_balance > 0.00)
);

-- Savings_Account table
CREATE TABLE Savings_Account (
  Savings_acc_id INT PRIMARY KEY,
  Acc_id INT,
  SA_plan_id INT,
  No_of_withdrawals INT CHECK (No_of_withdrawals >= 0),
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id),
  FOREIGN KEY (SA_plan_id) REFERENCES SA_plan (SA_plan_id)
);

-- Employee table
CREATE TABLE Employee (
  Employee_id INT PRIMARY KEY,
  NIC VARCHAR(12),
  Branch_id INT,
  POSITION VARCHAR(25),
  Start_date DATETIME,
  End_date DATETIME,
  FOREIGN KEY (NIC) REFERENCES User (NIC),
  FOREIGN KEY (Branch_id) REFERENCES Branch (Branch_id)
);

-- Activity table
CREATE TABLE Activity (
  Activity_id INT PRIMARY KEY,
  Type ENUM(
    'Online Transfer',
    'Loan Deposit',
    'Loan Installment',
    'Interest'
  ),
  Amount DECIMAL(10, 2) CHECK (Amount > 0.00),
  DATE DATETIME
);

-- Loan_Request table
CREATE TABLE Loan_Request (
  Request_id INT PRIMARY KEY,
  Loan_type ENUM('Business', 'Personal'),
  Acc_id INT,
  Amount DECIMAL(10, 2) CHECK (Amount > 0.00),
  Purpose VARCHAR(300),
  Employee_id INT,
  Manager_id INT,
  Status ENUM('Pending', 'Accepted', 'Rejected'),
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id),
  FOREIGN KEY (Employee_id) REFERENCES Employee (Employee_id),
  FOREIGN KEY (Manager_id) REFERENCES Employee (Employee_id)
);

-- Loan table
CREATE TABLE Loan (
  Loan_id INT PRIMARY KEY,
  Type ENUM('Business', 'Personal'),
  Amount DECIMAL(10, 2) CHECK (Amount > 0.00),
  Interest_rate DECIMAL(4, 3) CHECK (Interest_rate BETWEEN 0 AND 1),
  Purpose VARCHAR(300),
  Request_id INT,
  Customer_id INT,
  Acc_id INT,
  Activity_id INT,
  FOREIGN KEY (Request_id) REFERENCES Loan_Request (Request_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id),
  FOREIGN KEY (Activity_id) REFERENCES Activity (Activity_id),
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id)
);

-- FD_plan table
CREATE TABLE FD_plan (
  FD_plan_id INT PRIMARY KEY,
  Duration INT,
  Interest_rate DECIMAL(4, 3) CHECK (Interest_rate BETWEEN 0 AND 1)
);

-- Fixed_deposit table
CREATE TABLE Fixed_deposit (
  FD_id INT PRIMARY KEY,
  Branch_id INT,
  Customer_id INT,
  Balance DECIMAL(10, 2) CHECK (Balance > 0.00),
  Savings_acc_id INT,
  Opened_date DATETIME,
  FD_plan_id INT,
  FOREIGN KEY (Branch_id) REFERENCES Branch (Branch_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id),
  FOREIGN KEY (Savings_acc_id) REFERENCES Savings_Account (Savings_acc_id),
  FOREIGN KEY (FD_plan_id) REFERENCES FD_plan (FD_plan_id)
);

-- Transaction table
CREATE TABLE Transaction (
  Transaction_id INT PRIMARY KEY,
  Acc_id INT,
  Activity_id INT,
  Type ENUM('Deposit', 'Withdrawal'),
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id),
  FOREIGN KEY (Activity_id) REFERENCES Activity (Activity_id)
);

-- Loan_Installments table
CREATE TABLE Loan_Installments (
  Loan_id INT,
  DATE DATETIME,
  Amount DECIMAL(10, 2) CHECK (Amount >= 0.00),
  Activity_id INT,
  FOREIGN KEY (Loan_id) REFERENCES Loan (Loan_id),
  FOREIGN KEY (Activity_id) REFERENCES Activity (Activity_id)
);

-- Organization table
CREATE TABLE Organization (
  Organization_id INT PRIMARY KEY,
  Organization_name VARCHAR(100),
  Type VARCHAR(100),
  Address VARCHAR(200),
  Phone_number INT,
  Date_of_incorporation DATETIME,
  Login_id INT,
  Customer_id INT,
  FOREIGN KEY (Login_id) REFERENCES Login (Login_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id)
);

----------------------------------------
--                                    --
--             Indexes                --
--                                    --
----------------------------------------
----------------------------------------
--                                    --
--             Triggers               --
--                                    --
----------------------------------------
----------------------------------------
--                                    --
--               Views                --
--                                    --
----------------------------------------
----------------------------------------
--                                    --
--              Functions             --
--                                    --
----------------------------------------
----------------------------------------
--                                    --
--             Procedures             --
--                                    --
----------------------------------------
