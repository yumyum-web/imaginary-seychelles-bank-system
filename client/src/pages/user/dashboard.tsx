import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountOverview } from "./components/accountOverview";
import { LoanOverview } from "./components/loanOverview";
import { FDOverview } from "./components/fdOverview";

export default function Dashboard() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="overview"
        className="space-y-4"
      >
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fd">Fixed Deposits</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <AccountOverview />
        </TabsContent>
        <TabsContent value="fd" className="space-y-4">
          <FDOverview />
        </TabsContent>
        <TabsContent value="loans" className="space-y-4">
          <LoanOverview />
        </TabsContent>
      </Tabs>
    </>
  );
}
