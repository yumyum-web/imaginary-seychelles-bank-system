INSERT INTO
  Branch (Branch_id, Name, Address)
VALUES
  (
    1,
    'Main Branch',
    '123 Main St, Colombo, Srilanka'
  ),
  (
    2,
    'West Branch',
    '456 West St, Colombo, Srilanka'
  ),
  (
    3,
    'North Branch',
    '101 North St, Jaffna, Srilanka'
  );

INSERT INTO
  Customer (Customer_id, Customer_type)
VALUES
  (1, 'Individual'),
  (2, 'Individual'),
  (3, 'Organization'),
  (4, 'Individual'),
  (5, 'Organization');

INSERT INTO
  Login (
    Login_id,
    Username,
    Password,
    Password_last_update
  )
VALUES
  (1, 'jdoe', 'password123', '2023-05-01 10:00:00'),
  (2, 'amayas', 'password456', '2023-06-01 11:00:00'),
  (3, 'orgtech', 'orgpass789', '2023-07-15 09:30:00'),
  (
    4,
    'michpere',
    'passmark001',
    '2023-08-01 08:45:00'
  ),
  (
    5,
    'engenter',
    'entpass333',
    '2023-09-20 16:00:00'
  ),
  (6, 'alicej', 'empass111', '2023-09-25 11:00:00'),
  (7, 'bobw', 'empass222', '2023-09-25 13:00:00'),
  (
    8,
    'catherinej',
    'empass333',
    '2023-09-25 13:00:00'
  ),
  (9, 'davidc', 'empass444', '2023-09-25 14:00:00'),
  (10, 'eve', 'empass555', '2023-09-25 16:00:00'),
  (11, 'anya', 'empass675', '2023-09-25 17:00:00');

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
    'A123456789',
    'John',
    'Doe',
    '123 Main St',
    '252123456',
    '1950-05-12',
    1,
    1
  ), -- Individual Customer
  (
    'C654321987',
    'Amaya',
    'Siriwardena',
    '78 Coral Rd',
    '252654321',
    '2000-08-21',
    2,
    2
  ), -- Individual Customer
  (
    'E321654987',
    'Michael',
    'Perera',
    '34 Lagoon St',
    '252321789',
    '1988-12-30',
    4,
    4
  ), -- Individual Customer
  (
    'F111111111',
    'Alice',
    'Johnson',
    '12 Sea View',
    '252111111',
    '1988-10-10',
    6,
    NULL
  ), -- Employee
  (
    'F222222222',
    'Bob',
    'Williams',
    '24 Hilltop',
    '252222222',
    '1992-05-30',
    7,
    NULL
  ), -- Employee
  (
    'F333333333',
    'Catherine',
    'Johnson',
    '88 Maple St',
    '252333333',
    '1983-12-12',
    8,
    NULL
  ), -- Employee
  (
    'F444444444',
    'David',
    'Clark',
    '45 Park Ave',
    '252444444',
    '1990-03-22',
    9,
    NULL
  ), -- Employee
  (
    'F555555555',
    'Eve',
    'Davis',
    '67 River Rd',
    '252555555',
    '1980-07-15',
    10,
    NULL
  ), -- Employee
  (
    'F558559815',
    'Anya',
    'Davis',
    '61 Hill Rd',
    '202556755',
    '1995-07-15',
    11,
    NULL
  );

INSERT INTO
  Account (
    Acc_id,
    Branch_id,
    Customer_id,
    Type,
    Balance,
    Opened_date
  )
VALUES
  (
    101,
    1,
    1,
    'Savings',
    5000.00,
    '2021-05-10 09:00:00'
  ),
  (
    102,
    2,
    3,
    'Checking',
    25000.50,
    '2022-01-22 11:30:00'
  ),
  (
    103,
    3,
    2,
    'Savings',
    10000.00,
    '2023-03-05 14:00:00'
  ),
  (
    104,
    1,
    5,
    'Checking',
    29700.25,
    '2023-04-18 10:45:00'
  ),
  (
    105,
    2,
    4,
    'Savings',
    600000.75,
    '2022-12-30 15:20:00'
  );

INSERT INTO
  SA_plan (SA_plan_id, Name, Interest_rate, Min_balance)
VALUES
  (1, 'Children Savings Plan', 0.12, 100.00), -- No minimum balance
  (2, 'Teen Savings Plan', 0.11, 500.00), -- Minimum balance: 500
  (3, 'Adult Savings Plan', 0.10, 1000.00), -- Minimum balance: 1000
  (4, 'Senior Savings Plan', 0.13, 1000.00);

-- Minimum balance: 1000
INSERT INTO
  Savings_Account (
    Savings_acc_id,
    Acc_id,
    SA_plan_id,
    No_of_withdrawals
  )
VALUES
  (1, 101, 4, 3),
  (2, 103, 3, 2),
  (3, 105, 3, 1);

INSERT INTO
  Employee (
    Employee_id,
    NIC,
    Branch_id,
    POSITION,
    Start_date,
    End_date
  )
VALUES
  (
    1,
    'F111111111',
    1,
    'Loan Officer',
    '2020-01-01 09:00:00',
    NULL
  ), -- Employee
  (
    2,
    'F222222222',
    1,
    'Branch Manager',
    '2020-01-01 09:00:00',
    NULL
  ), -- Employee
  (
    3,
    'F333333333',
    3,
    'Branch Manager',
    '2020-01-01 09:00:00',
    NULL
  ), -- Employee
  (
    4,
    'F444444444',
    3,
    'Loan Officer',
    '2020-01-01 09:00:00',
    NULL
  ), -- Employee
  (
    5,
    'F555555555',
    2,
    'Branch Manager',
    '2020-01-01 09:00:00',
    NULL
  ), -- Employee
  (
    6,
    'F558559815',
    2,
    'Loan Officer',
    '2020-01-01 09:00:00',
    NULL
  );

-- Activity Data
INSERT INTO
  Activity (Activity_id, Type, Amount, DATE)
VALUES
  (
    1,
    'Loan Deposit',
    50000.00,
    '2023-07-01 14:00:00'
  ),
  (
    2,
    'Loan Deposit',
    20000.00,
    '2023-07-15 10:00:00'
  ),
  (
    3,
    'Loan Deposit',
    80000.00,
    '2023-08-01 11:00:00'
  ),
  (
    4,
    'Loan Installment',
    500.00,
    '2023-09-15 09:00:00'
  ),
  (5, 'Interest', 75.00, '2023-09-30 15:00:00');

INSERT INTO
  Loan_Request (
    Request_id,
    Loan_type,
    Acc_id,
    Amount,
    Purpose,
    Employee_id,
    Manager_id,
    Status
  )
VALUES
  (
    1,
    'Business',
    101,
    50000.00,
    'Business Expansion',
    1,
    2,
    'Accepted'
  ),
  (
    2,
    'Personal',
    103,
    20000.00,
    'Home Renovation',
    4,
    3,
    'Accepted'
  ),
  (
    3,
    'Personal',
    105,
    15000.00,
    'Car Purchase',
    6,
    5,
    'Accepted'
  );

INSERT INTO
  Loan (
    Loan_id,
    Type,
    Amount,
    Interest_rate,
    Purpose,
    Request_id,
    Customer_id,
    Acc_id,
    Activity_id
  )
VALUES
  (
    1,
    'Business',
    50000.00,
    0.05,
    'Business Expansion',
    1,
    1,
    101,
    1
  ),
  (
    2,
    'Personal',
    20000.00,
    0.03,
    'Home Renovation',
    2,
    2,
    103,
    2
  ),
  (
    3,
    'Business',
    80000.00,
    0.06,
    'New Product Development',
    NULL,
    3,
    102,
    3
  ),
  (
    4,
    'Personal',
    15000.00,
    0.04,
    'Car Purchase',
    3,
    4,
    105,
    4
  ),
  (
    5,
    'Business',
    120000.00,
    0.055,
    'Office Renovation',
    NULL,
    5,
    105,
    5
  );

INSERT INTO
  FD_plan (FD_plan_id, Duration, Interest_rate)
VALUES
  (1, 6, 0.13), -- 6 months at 13%
  (2, 12, 0.14), -- 1 year at 14%
  (3, 36, 0.15);

-- 3 years at 15%
INSERT INTO
  Fixed_deposit (
    FD_id,
    Branch_id,
    Customer_id,
    Balance,
    Savings_acc_id,
    Opened_date,
    FD_plan_id
  )
VALUES
  (1, 1, 1, 100000.00, 1, '2023-01-01 09:00:00', 1), -- FD with 6 months plan at 13%
  (2, 3, 2, 2550000.00, 2, '2023-02-01 10:00:00', 2), -- FD with 1 year plan at 14%
  (3, 2, 4, 1600000.00, 3, '2023-03-01 11:00:00', 3);

-- FD with 3 years plan at 15%
INSERT INTO
  Transaction (Transaction_id, Acc_id, Activity_id, Type)
VALUES
  (1, 101, 1, 'Deposit'), -- Loan deposit is a Deposit
  (2, 103, 2, 'Deposit'), -- Loan deposit
  (3, 102, 3, 'Deposit'), -- Loan Deposit is a Deposit
  (4, 104, 4, 'Withdrawal'), -- Loan Installment is a Withdrawal
  (5, 105, 5, 'Deposit');

-- Interest is a Deposit
INSERT INTO
  Loan_Installments (Loan_id, DATE, Amount, Activity_id)
VALUES
  (1, '2023-08-10 10:00:00', 1000.00, 4),
  (4, '2023-08-15 10:00:00', 5000.00, NULL);

INSERT INTO
  Organization (
    Organization_id,
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
    1,
    'Tech Solutions',
    'IT Services',
    '111 Innovation Rd, City',
    555123456,
    '2010-01-01 00:00:00',
    3,
    3
  ),
  (
    2,
    'Smart Designs',
    'Creative Agency',
    '222 Design St, City',
    555654321,
    '2012-04-15 00:00:00',
    5,
    5
  );
