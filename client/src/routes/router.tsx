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
          { index: true, element: <LateLoanInstallments /> },
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
          { index: true, element: <CreateSavingsAccount /> },
          { path: "create-savings-account", element: <CreateSavingsAccount /> },
          {
            path: "create-checkings-account",
            element: <CreateCheckingsAccount />,
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
