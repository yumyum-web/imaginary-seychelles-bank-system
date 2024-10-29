import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/custom/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import {
  listCheckingAccounts,
  listFixedDeposits,
  listSavingsAccounts,
} from "@/api/accounts";
import { selfApplyForLoan } from "@/api/loans";
import { toast } from "@/hooks/use-toast";
interface Account {
  id: string;
  label: string;
}

// Define form schema
const formSchema = z.object({
  FD_id: z.string().min(1, { message: "Fixed Deposit ID is required." }),
  acc_id: z.string().min(1, { message: "Account ID is required." }),
  loan_type: z.enum(["Business", "Personal"], {
    required_error: "Loan type is required.",
  }),
  purpose: z
    .string()
    .min(10, { message: "Purpose must be at least 10 characters." }),
  time_period: z.preprocess(
    (value) => parseInt(value as string),
    z
      .number({
        invalid_type_error: "Time period must be a number.",
      })
      .min(1, { message: "Time period must be greater than 0." }),
  ),
  amount: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Amount must be a number.",
      })
      .min(0, { message: "Amount must be a positive number." }),
  ),
});

export function OnlineLoan() {
  const [fixedDeposits, setFixedDeposits] = useState<Account[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const savingsAccounts = await listSavingsAccounts();
        const checkingAccounts = await listCheckingAccounts();
        const tempFixedDeposits = await listFixedDeposits();

        const fetchedAccounts: Account[] = [];
        const fetchedFixedDeposits: Account[] = [];

        savingsAccounts.forEach((account) => {
          fetchedAccounts.push({
            id: account.id.toString(),
            label: `${account.id} - ${account.branchName}`,
          });
        });
        checkingAccounts.forEach((account) => {
          fetchedAccounts.push({
            id: account.id.toString(),
            label: `${account.id} - ${account.branchName}`,
          });
        });
        tempFixedDeposits.forEach((account) => {
          fetchedFixedDeposits.push({
            id: account.id.toString(),
            label: `${account.id} - ${account.branchName}`,
          });
        });

        setFixedDeposits(fetchedFixedDeposits);
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FD_id: "",
      acc_id: "",
      loan_type: "Business" as "Business" | "Personal",
      purpose: "",
      time_period: 0,
      amount: 0,
    },
  });

  // Submit handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const message = await selfApplyForLoan(
        parseInt(data.FD_id),
        parseInt(data.acc_id),
        data.loan_type,
        data.amount,
        data.purpose,
        data.time_period,
      );

      toast({
        title: "Success",
        description: message,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as { message?: string })?.message ||
          "Failed to apply self loan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Apply for a loan
        </h1>
        <p className="text-muted-foreground">Apply for a new online loan</p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 lg:flex-row md:overflow-auto lg:space-x-12 lg:space-y-0 md:px-6 lg:px-10 no-scrollbar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="FD_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select FD</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? fixedDeposits.find(
                                (account) => account.id === field.value,
                              )?.label
                            : "Select account"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search account..." />
                        <CommandList>
                          <CommandEmpty>No account found.</CommandEmpty>
                          <CommandGroup heading="accounts">
                            {fixedDeposits.map((account) => (
                              <CommandItem
                                value={account.label}
                                key={account.id}
                                onSelect={() => {
                                  form.setValue("FD_id", account.id); // Set account description
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    account.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {account.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the account that loan gets deposited to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acc_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Account</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? accounts.find(
                                (account) => account.id === field.value,
                              )?.label
                            : "Select account"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search account..." />
                        <CommandList>
                          <CommandEmpty>No account found.</CommandEmpty>
                          <CommandGroup heading="accounts">
                            {accounts.map((account) => (
                              <CommandItem
                                value={account.label}
                                key={account.id}
                                onSelect={() => {
                                  form.setValue("acc_id", account.id); // Set account description
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    account.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {account.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the account that loan gets deposited to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loan_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the type of loan you want to request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purpose Field */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Purpose"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide a detailed description of the purpose for
                    which you are requesting this loan.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Period</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Months"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The time period for the loan request in months
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      {...field}
                      value={field.value !== undefined ? field.value : ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>The requested loan amount.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 text-md" loading={isLoading}>
              {isLoading ? "Loading..." : "Apply loan"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
