import { Layout } from "@/layouts/layout";
import { Search } from "@/components/custom/search";
import ThemeSwitch from "@/components/custom/themeSwitch";
import { UserNav } from "@/components/navigation/userNav";
// import { DataTable } from './components/data-table'
// import { columns } from './components/columns'
// import { tasks } from './data/tasks'
import { Outlet } from "react-router-dom";

export default function Manager() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <Outlet />
      </Layout.Body>
    </Layout>
  );
}
