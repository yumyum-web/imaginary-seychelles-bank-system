import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component for the tag
import { FixedDeposit } from "@/api/types";
import { useEffect, useState } from "react";
import { listFixedDeposits } from "@/api/accounts";

// Component to display each account in a card
export function FDOverview() {
  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>([]);

  useEffect(() => {
    const fetchFD = async () => {
      try {
        const fdList = await listFixedDeposits();
        setFixedDeposits(fdList);
      } catch (error) {
        console.error("Error fetching fixed deposits:", error);
      }
    };

    fetchFD();
  }, []);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        {fixedDeposits.map((fixedDeposit) => (
          <Card key={fixedDeposit.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                FD - {fixedDeposit.id}
              </CardTitle>
              <Badge className="text-xs bg-muted text-muted-foreground">
                {fixedDeposit.branchName}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fixedDeposit.balance}</div>
              <p className="text-xs text-muted-foreground">
                Fixed Deposit Amount
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
