import { RouteObject } from "react-router-dom";
import GeneralError from "@/pages/errors/generalError";
import NotFoundError from "@/pages/errors/notFoundError";
import MaintenanceError from "@/pages/errors/maintenanceError";
import UnauthorisedError from "@/pages/errors/unauthorisedError";
import SignIn from "@/pages/auth/signIn";
import Main from "@/layouts/main";
import Manager from "@/pages/manager/index";
import { LateLoanInstallments } from "@/pages/manager/lateLoanInstallments";
import { TotalTransactions } from "@/pages/manager/totalTransactions";
import { LoanRequests } from "@/pages/manager/loanRequests";
import Employee from "@/pages/employee";
import { CreateSavingsAccount } from "@/pages/employee/createSavingsAccount";
import { CreateCheckingsAccount } from "@/pages/employee/createCheckingAccount";
import ProtectedRoute from "./protectedRoute";
import ComingSoon from "@/components/comingSoon";
import { CreateLoanRequest } from "@/pages/employee/createLoanRequest";
import { CreateFixedDeposit } from "@/pages/employee/createFixedDesposit";
import { OnlineTransfer } from "@/pages/user/onlineTransfer";
import { OnlineLoan } from "@/pages/user/onlineLoan";
import Dashboard from "@/pages/user/dashboard";

const routes: RouteObject[] = [
  { path: "/sign-in", element: <SignIn /> },
  {
    path: "/",
    element: <Main />,
    errorElement: <GeneralError />,
    children: [
      {
        path: "manager",
        element: (
          <ProtectedRoute requiredLevels={["manager"]}>
            <Manager />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <ComingSoon /> },
          { path: "late-loan-installments", element: <LateLoanInstallments /> },
          { path: "total-transactions", element: <TotalTransactions /> },
          { path: "loan-requests", element: <LoanRequests /> },
        ],
      },
      {
        path: "employee",
        element: (
          <ProtectedRoute requiredLevels={["employee"]}>
            <Employee />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <ComingSoon /> },
          { path: "create-savings-account", element: <CreateSavingsAccount /> },
          {
            path: "create-checkings-account",
            element: <CreateCheckingsAccount />,
          },
          {
            path: "create-fixed-deposit",
            element: <CreateFixedDeposit />,
          },
          {
            path: "request-loans",
            element: <CreateLoanRequest />,
          },
        ],
      },
      {
        path: "user",
        element: (
          <ProtectedRoute requiredLevels={["user"]}>
            <Employee />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          {
            path: "transfer",
            element: <OnlineTransfer />,
          },
          {
            path: "online-loan",
            element: <OnlineLoan />,
          },
        ],
      },
    ],
  },
  { path: "/500", element: <GeneralError /> },
  { path: "/404", element: <NotFoundError /> },
  { path: "/503", element: <MaintenanceError /> },
  { path: "/401", element: <UnauthorisedError /> },
  { path: "*", element: <NotFoundError /> },
];

export default routes;
