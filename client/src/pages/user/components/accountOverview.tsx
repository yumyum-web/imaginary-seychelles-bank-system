import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component for the tag

// Dummy accounts data
const accountsData = [
  { id: "ACC123456", balance: "$10,000.00", type: "Savings" },
  { id: "ACC654321", balance: "$5,250.75", type: "Checking" },
  { id: "ACC112233", balance: "$25,400.50", type: "Business" },
  { id: "ACC778899", balance: "$15,850.30", type: "Personal" },
];

// Component to display each account in a card
export function AccountCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {accountsData.map((account) => (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{account.id}</CardTitle>
            <Badge className="text-xs bg-muted text-muted-foreground">
              {account.type}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{account.balance}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
