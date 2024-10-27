import {
  IconChartInfographic,
  IconTransfer,
  IconHourglassEmpty,
  IconLayoutDashboard,
  IconRouteAltLeft,
  IconCirclePlus,
  IconPigMoney,
  IconChecks,
  IconBox,
  IconHeartHandshake,
  IconCreditCardPay,
  IconBuildingBank,
} from "@tabler/icons-react";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

// Manager specific links
export const managerLinks = [
  {
    title: "Dashboard",
    label: "",
    href: "/manager",
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: "Loan Requests",
    label: "10",
    href: "/manager/loan-requests",
    icon: <IconRouteAltLeft size={18} />,
  },
  {
    title: "Reports",
    label: "10",
    href: "/manager/reports",
    icon: <IconChartInfographic size={18} />,
    sub: [
      {
        title: "Transactions",
        label: "9",
        href: "/manager/total-transactions",
        icon: <IconTransfer size={18} />,
      },
      {
        title: "Late Loan Installments",
        label: "",
        href: "/manager/late-loan-installments",
        icon: <IconHourglassEmpty size={18} />,
      },
    ],
  },
];

// Employee specific links
export const employeeLinks = [
  {
    title: "Dashboard",
    label: "",
    href: "/employee",
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: "Open Accounts",
    label: "",
    href: "/employee/open-accounts",
    icon: <IconCirclePlus size={18} />,
    sub: [
      {
        title: "Savings Account",
        label: "",
        href: "/employee/create-savings-account",
        icon: <IconPigMoney size={18} />,
      },
      {
        title: "Checkings Account",
        label: "",
        href: "/employee/create-checkings-account",
        icon: <IconChecks size={18} />,
      },
      {
        title: "Fixed Deposit",
        label: "",
        href: "/employee/create-fixed-deposit",
        icon: <IconBox size={18} />,
      },
    ],
  },
  {
    title: "Request Loans",
    label: "",
    href: "/employee/request-loans",
    icon: <IconHeartHandshake size={18} />,
  },
];

export const userLinks = [
  {
    title: "Dashboard",
    label: "",
    href: "/user",
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: "Online transfer",
    label: "",
    href: "/user/transfer",
    icon: <IconCreditCardPay size={18} />,
    // sub: [
    //   {
    //     title: "Savings Account",
    //     label: "",
    //     href: "/employee/create-savings-account",
    //     icon: <IconPigMoney size={18} />,
    //   },
    //   {
    //     title: "Checkings Account",
    //     label: "",
    //     href: "/employee/create-checkings-account",
    //     icon: <IconChecks size={18} />,
    //   },
    //   {
    //     title: "Fixed Deposit",
    //     label: "",
    //     href: "/employee/create-fixed-deposit",
    //     icon: <IconBox size={18} />,
    //   },
    // ],
  },
  {
    title: "Online loans",
    label: "",
    href: "/user/online-loan",
    icon: <IconBuildingBank size={18} />,
  },
];
