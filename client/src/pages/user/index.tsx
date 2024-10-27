import { Outlet } from "react-router-dom";
import { Layout } from "@/layouts/layout";
import { Search } from "@/components/custom/search";
import ThemeSwitch from "@/components/custom/themeSwitch";
import { UserNav } from "@/components/navigation/userNav";

export default function Employee() {
  return (
    <Layout fixed>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body className="flex flex-col">
        <Outlet />
      </Layout.Body>
    </Layout>
  );
}
