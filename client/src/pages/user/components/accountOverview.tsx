import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Assuming you have a Badge component for the tag
import { CheckingAccount, SavingsAccount, Transaction } from "@/api/types";
import { useEffect, useState } from "react";
import {
  getTransactionHistory,
  listCheckingAccounts,
  listSavingsAccounts,
} from "@/api/accounts";
import { TransactionHistory } from "./transactionHistory";

// Component to display each account in a card
export function AccountOverview() {
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
  const [checkingAccounts, setCheckingAccounts] = useState<CheckingAccount[]>(
    [],
  );
  const [currAccountId, setCurrAccountId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const checkingAccountsList = await listCheckingAccounts();
        const savingsAccountsList = await listSavingsAccounts();
        setCurrAccountId(
          savingsAccountsList[0].id || checkingAccountsList[0].id,
        );

        setCheckingAccounts(checkingAccountsList);
        setSavingsAccounts(savingsAccountsList);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currAccountId) return;
      try {
        const transactions = await getTransactionHistory(currAccountId);
        setTransactions(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, [currAccountId]);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        {savingsAccounts.map((account) => (
          <Card
            key={account.id}
            className={`${
              currAccountId === account.id ? "border-2 border-primary" : ""
            }`}
            onClick={() => setCurrAccountId(account.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ACC - {account.id}
              </CardTitle>
              <Badge className="text-xs bg-muted text-muted-foreground">
                Savings
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.balance}</div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
            </CardContent>
          </Card>
        ))}
        {checkingAccounts.map((account) => (
          <Card
            key={account.id}
            className={`${
              currAccountId === account.id ? "border-2 border-primary" : ""
            }`}
            onClick={() => setCurrAccountId(account.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                ACC - {account.id}
              </CardTitle>
              <Badge className="text-xs bg-muted text-muted-foreground">
                Checking
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.balance}</div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 ">
        <Card className="col-span-1 lg:col-span-12  ">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TransactionHistory transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
