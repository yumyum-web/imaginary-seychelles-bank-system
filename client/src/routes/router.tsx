import { createBrowserRouter } from "react-router-dom";
import GeneralError from "@/pages/errors/generalError";
import NotFoundError from "@/pages/errors/notFoundError";
import MaintenanceError from "@/pages/errors/maintenanceError";
import UnauthorisedError from "@/pages/errors/unauthorisedError";
import SignIn from "@/pages/auth/signIn";
// import ForgotPassword from './pages/auth/forgot-password'
import Main from "@/layouts/main";
import Manager from "@/pages/manager/index";
import { LateLoanInstallments } from "@/pages/manager/lateLoanInstallments";
import { TotalTransactions } from "@/pages/manager/totalTransactions";
import { LoanRequests } from "@/pages/manager/loanRequests";
import Employee from "@/pages/employee";
import { CreateSavingsAccount } from "@/pages/employee/createSavingsAccount";
import { CreateCheckingsAccount } from "@/pages/employee/createCheckingAccount";
// import Dashboard from './pages/dashboard'
// import Tasks from './pages/tasks'
// import Chats from './pages/chats'
// import Apps from './pages/apps'
// import ComingSoon from './components/coming-soon'
// import ExtraComponents from './pages/extra-components'
// import Settings from './pages/settings'
// import Profile from './pages/settings/profile'
// import Account from './pages/settings/account'
// import Appearance from './pages/settings/appearance'
// import Notifications from './pages/settings/notifications'
// import Display from './pages/settings/display'
// import ErrorExample from './pages/settings/error-example'

const router = createBrowserRouter([
  // Auth routes
  { path: "/sign-in", Component: SignIn },

  // Main routes
  {
    path: "/",
    Component: Main,
    errorElement: <GeneralError />,
    children: [
      { index: true, Component: Manager },
      {
        path: "manager",
        Component: Manager,
        errorElement: <GeneralError />,
        children: [
          { index: true, Component: LateLoanInstallments },
          { path: "late-loan-installments", Component: LateLoanInstallments },
          { path: "total-transactions", Component: TotalTransactions },
          { path: "loan-requests", Component: LoanRequests },
        ],
      },
      {
        path: "employee",
        Component: Employee,
        errorElement: <GeneralError />,
        children: [
          { index: true, Component: CreateSavingsAccount },
          { path: "create-savings-account", Component: CreateSavingsAccount },
          {
            path: "create-checkings-account",
            Component: CreateCheckingsAccount,
          },
          // { path: "total-transactions", Component: TotalTransactions },
          // { path: "loan-requests", Component: LoanRequests },
          //   {
          //     path: 'error-example',
          //     Component: ErrorExample,
          //     errorElement: <GeneralError className="h-[50svh]" minimal />,
          //   },
        ],
      },
    ],
  },

  // Error routes
  { path: "/500", Component: GeneralError },
  { path: "/404", Component: NotFoundError },
  { path: "/503", Component: MaintenanceError },
  { path: "/401", Component: UnauthorisedError },

  // Fallback 404 route
  { path: "*", Component: NotFoundError },
]);

export default router;
