import { useEffect, useState } from "react";
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react";
import { Layout } from "@/layouts/layout";
import { Button } from "@/components/custom/button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import {
  managerLinks,
  employeeLinks,
  NavLink,
  userLinks,
} from "@/routes/navlinks";
import { useUser } from "@/contexts/useUser";
import { Employee, Individual, Organization } from "@/contexts/types";
interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const { user, userLevels } = useUser(); // Use userLevels instead of user.type
  const [title, setTitle] = useState<string | null>(null);
  const [navOpened, setNavOpened] = useState(false);

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  // Determine which navigation links to display based on userLevels
  let links: NavLink[] = [];

  if (userLevels?.includes("manager")) {
    links = [...links, ...managerLinks];
  } else if (userLevels?.includes("employee")) {
    links = [...links, ...employeeLinks];
  } else if (
    userLevels?.includes("user") ||
    userLevels?.includes("organization")
  ) {
    links = [...links, ...userLinks];
  }

  // Handle the case when userLevels is null or empty
  if (!userLevels || userLevels.length === 0) {
    // You can redirect to sign-in or show default links
    // For this example, we'll redirect to sign-in
    // Note: Ensure that your routing logic handles this
    // You might need to use useNavigate here if necessary
    links = []; // Or provide default links
  }

  useEffect(() => {
    if (userLevels?.includes("manager")) {
      setTitle("Manager Dashboard");
    } else if (userLevels?.includes("employee")) {
      if ((user as Employee)?.position) {
        setTitle((user as Employee).position);
      }
    } else if (
      userLevels?.includes("user") ||
      userLevels?.includes("organization")
    ) {
      if (user as Individual) {
        setTitle("Customer Dashboard");
      } else if (user as Organization) {
        setTitle("Organization Dashboard");
      }
    }
  }, [userLevels, user]);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${
          isCollapsed ? "md:w-14" : "md:w-64"
        }`,
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? "h-svh" : ""}>
        {/* Header */}
        <Layout.Header
          sticky
          className="z-50 flex justify-between px-4 py-3 shadow-sm md:px-4"
        >
          <div className={`flex items-center ${!isCollapsed ? "gap-2" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className={`transition-all ${
                isCollapsed ? "h-6 w-6" : "h-8 w-8"
              }`}
            >
              <rect width="256" height="256" fill="none"></rect>
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <span className="sr-only">Website Name</span>
            </svg>
            <div
              className={`flex flex-col justify-end truncate ${
                isCollapsed ? "invisible w-0" : "visible w-auto"
              }`}
            >
              <span className="font-medium">{title}</span>
              <span className="text-xs">
                {(user as Employee)?.branchName
                  ? `${(user as Employee).branchName}`
                  : ""}
              </span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${
            navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"
          }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={links}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </Layout>
    </aside>
  );
}
