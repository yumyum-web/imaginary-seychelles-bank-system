import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component for the tag
import { Loan, PendingLoanInstallment } from "@/api/types";
import { useEffect, useState } from "react";
import { getPendingLoanInstallments, listLoans } from "@/api/loans";
import { PendingLoanInstallments } from "./pendingLoanInstallments";

// Component to display each account in a card
export function LoanOverview() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pendingInstallments, setPendingInstallments] = useState<
    PendingLoanInstallment[]
  >([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansList = await listLoans();
        setLoans(loansList);
      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    const fetchLoanInstallemnts = async () => {
      try {
        const loanInstallments = await getPendingLoanInstallments();
        setPendingInstallments(loanInstallments);
      } catch (error) {
        console.error("Error Fetching Installments:", error);
      }
    };
    fetchLoanInstallemnts();
  }, []);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        {loans.map((loan) => (
          <Card key={loan.loanId}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Loan - {loan.loanId}
              </CardTitle>
              <Badge className="text-xs bg-muted text-muted-foreground">
                {loan.loanType}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loan.amount}</div>
              <p className="text-xs text-muted-foreground">Loan Amount</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 ">
        <Card className="col-span-1 lg:col-span-12  ">
          <CardHeader>
            <CardTitle>Pending Loan Installments</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <PendingLoanInstallments
              pendingInstallments={pendingInstallments}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
