----------------------------------------
--                                    --
--             Tables                 --
--                                    --
----------------------------------------
-- Branch table
CREATE TABLE Branch (
  Branch_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Address VARCHAR(300) NOT NULL,
);

-- Customer table
CREATE TABLE Customer (
  Customer_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Customer_type ENUM('Individual', 'Organization') NOT NULL
);

-- Login table
CREATE TABLE Login (
  Login_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Username VARCHAR(25) NOT NULL,
  Password VARCHAR(25) NOT NULL,
  Password_last_update DATETIME NOT NULL
);

-- User Table
CREATE TABLE User (
  NIC VARCHAR(12) PRIMARY KEY NOT NULL,
  First_Name VARCHAR(100) NOT NULL,
  Last_Name VARCHAR(100) NOT NULL,
  Address VARCHAR(200) NOT NULL,
  Phone_number INT NOT NULL,
  Date_of_Birth DATETIME NOT NULL,
  Login_id INT,
  Customer_id INT,
  FOREIGN KEY (Login_id) REFERENCES Login (Login_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id)
);

-- Account table
CREATE TABLE Account (
  Acc_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Branch_id INT NOT NULL,
  Customer_id INT NOT NULL,
  Type ENUM('Savings', 'Checking') NOT NULL,
  Balance DECIMAL(10, 2) CHECK (Balance > 0.00) NOT NULL,
  Opened_date DATETIME NOT NULL,
  FOREIGN KEY (Branch_id) REFERENCES Branch (Branch_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id)
);

-- SA_plan table
CREATE TABLE SA_plan (
  SA_plan_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Name VARCHAR(30) NOT NULL,
  Interest_rate DECIMAL(4, 3) CHECK (Interest_rate BETWEEN 0 AND 1) NOT NULL,
  Min_balance DECIMAL(10, 2) CHECK (Min_balance >= 0.00) NOT NULL
);

-- Savings_Account table
CREATE TABLE Savings_Account (
  Savings_acc_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Acc_id INT NOT NULL,
  SA_plan_id INT NOT NULL,
  No_of_withdrawals INT CHECK (No_of_withdrawals >= 0) NOT NULL,
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id),
  FOREIGN KEY (SA_plan_id) REFERENCES SA_plan (SA_plan_id)
);

-- Employee table
CREATE TABLE Employee (
  Employee_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  NIC VARCHAR(12) NOT NULL,
  Branch_id INT NOT NULL,
  POSITION VARCHAR(25) NOT NULL,
  Start_date DATETIME NOT NULL,
  End_date DATETIME,
  FOREIGN KEY (NIC) REFERENCES User (NIC),
  FOREIGN KEY (Branch_id) REFERENCES Branch (Branch_id)
);

-- Activity table
CREATE TABLE Activity (
  Activity_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Type ENUM(
    'Online Transfer',
    'Loan Deposit',
    'Loan Installment',
    'Interest'
  ) NOT NULL,
  Amount DECIMAL(10, 2) CHECK (Amount > 0.00) NOT NULL,
  DATE DATETIME NOT NULL
);

-- Loan_Request table
CREATE TABLE Loan_Request (
  Request_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Loan_type ENUM('Business', 'Personal') NOT NULL,
  Acc_id INT NOT NULL,
  Amount DECIMAL(10, 2) CHECK (Amount > 0.00) NOT NULL,
  Purpose VARCHAR(300) NOT NULL,
  Employee_id INT NOT NULL,
  Manager_id INT,
  Time_Period INT NOT NULL,
  Status ENUM('Pending', 'Accepted', 'Rejected') NOT NULL,
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id),
  FOREIGN KEY (Employee_id) REFERENCES Employee (Employee_id),
  FOREIGN KEY (Manager_id) REFERENCES Employee (Employee_id)
);

-- Loan table
CREATE TABLE Loan (
  Loan_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Type ENUM('Business', 'Personal') NOT NULL,
  Amount DECIMAL(10, 2) CHECK (Amount > 0.00) NOT NULL,
  Interest_rate DECIMAL(4, 3) CHECK (Interest_rate BETWEEN 0 AND 1) NOT NULL,
  Purpose VARCHAR(300) NOT NULL,
  Request_id INT,
  Customer_id INT NOT NULL,
  Acc_id INT NOT NULL,
  Activity_id INT NOT NULL,
  StartDate DATE NOT NULL,
  EndDate DATE NOT NULL,
  FOREIGN KEY (Request_id) REFERENCES Loan_Request (Request_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id),
  FOREIGN KEY (Activity_id) REFERENCES Activity (Activity_id),
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id)
);

-- FD_plan table
CREATE TABLE FD_plan (
  FD_plan_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Duration INT CHECK (Duration > 0) NOT NULL,
  Interest_rate DECIMAL(4, 3) CHECK (Interest_rate BETWEEN 0 AND 1) NOT NULL
);

-- Fixed_deposit table
CREATE TABLE Fixed_deposit (
  FD_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Branch_id INT NOT NULL,
  Customer_id INT NOT NULL,
  Balance DECIMAL(10, 2) CHECK (Balance > 0.00) NOT NULL,
  Savings_acc_id INT NOT NULL,
  Opened_date DATETIME NOT NULL,
  FD_plan_id INT NOT NULL,
  FOREIGN KEY (Branch_id) REFERENCES Branch (Branch_id),
  FOREIGN KEY (Customer_id) REFERENCES Customer (Customer_id),
  FOREIGN KEY (Savings_acc_id) REFERENCES Savings_Account (Savings_acc_id),
  FOREIGN KEY (FD_plan_id) REFERENCES FD_plan (FD_plan_id)
);

-- Transaction table
CREATE TABLE Transaction (
  Transaction_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Acc_id INT NOT NULL,
  Activity_id INT NOT NULL,
  Type ENUM('Deposit', 'Withdrawal') NOT NULL,
  FOREIGN KEY (Acc_id) REFERENCES Account (Acc_id),
  FOREIGN KEY (Activity_id) REFERENCES Activity (Activity_id)
);

-- Loan_Installments table
CREATE TABLE Loan_Installments (
  Loan_id INT NOT NULL,
  DATE DATETIME NOT NULL,
  Amount DECIMAL(10, 2) CHECK (Amount >= 0.00) NOT NULL,
  Activity_id INT,
  FOREIGN KEY (Loan_id) REFERENCES Loan (Loan_id),
  FOREIGN KEY (Activity_id) REFERENCES Activity (Activity_id)
);

-- Organization table
CREATE TABLE Organization (
  Organization_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  Organization_name VARCHAR(100) NOT NULL,
  Type VARCHAR(100) NOT NULL,
  Address VARCHAR(200) NOT NULL,
  Phone_number INT NOT NULL,
  Date_of_incorporation DATETIME NOT NULL,
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
