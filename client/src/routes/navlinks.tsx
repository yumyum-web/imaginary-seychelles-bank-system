import {
  IconApps,
  IconChecklist,
  IconChartInfographic,
  IconTransfer,
  IconHourglassEmpty,
  IconLayoutDashboard,
  IconMessages,
  IconRouteAltLeft,
  IconSettings,
  // IconTruck,
  // IconBoxSeam,
  // IconUsers,
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
    href: "/manager/requests",
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
        href: "/manager/transactions",
        icon: <IconTransfer size={18} />,
      },
      {
        title: "Late Loan Installments",
        label: "",
        href: "/manager/lateloaninstallments",
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
    title: "Tasks",
    label: "3",
    href: "/employee/tasks",
    icon: <IconChecklist size={18} />,
  },
  {
    title: "Chats",
    label: "9",
    href: "/employee/chats",
    icon: <IconMessages size={18} />,
  },
  {
    title: "Apps",
    label: "",
    href: "/employee/apps",
    icon: <IconApps size={18} />,
  },
  {
    title: "Settings",
    label: "",
    href: "/employee/settings",
    icon: <IconSettings size={18} />,
  },
];
