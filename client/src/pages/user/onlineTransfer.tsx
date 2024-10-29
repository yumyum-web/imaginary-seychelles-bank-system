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
import { Input } from "@/components/ui/input";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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
  listSavingsAccounts,
  transferMoney,
} from "@/api/accounts";
import { useToast } from "@/hooks/use-toast";

interface Account {
  id: string;
  label: string;
}

// Define form schema
const formSchema = z.object({
  from_acc_id: z.string().min(1, { message: "Account ID is required." }),
  to_acc_id: z.string().min(1, { message: "Account ID is required." }),
  amount: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Amount must be a number.",
      })
      .min(0, { message: "Amount must be a positive number." }),
  ),
});

export function OnlineTransfer() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // Loading state for submit button

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const savingsAccounts = await listSavingsAccounts();
        const checkingAccounts = await listCheckingAccounts();

        const fetchedAccounts: Account[] = [];
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
      from_acc_id: "",
      to_acc_id: "",
      amount: 0,
    },
  });

  // Submit handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const message = await transferMoney(
        parseInt(data.from_acc_id),
        parseInt(data.to_acc_id),
        data.amount,
      );

      toast({
        title: "Transfer Successful",
        description: message,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description:
          (error as { message?: string })?.message ||
          "An error occurred while transferring money.",
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
          Online Transfer
        </h1>
        <p className="text-muted-foreground">
          Transfer money from one account to another
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0 md:px-6 lg:px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="from_acc_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select your Account</FormLabel>
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
                            ? accounts.find((acc) => acc.id === field.value)
                                ?.label
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
                            {accounts.map((acc) => (
                              <CommandItem
                                value={acc.label}
                                key={acc.id}
                                onSelect={() => {
                                  form.setValue("from_acc_id", acc.id);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    acc.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {acc.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the account ID of the account you want to transfer
                    money from.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to_acc_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver's Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Account" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the account ID of the account you want to transfer
                    money to.
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
                  <FormLabel>Amount</FormLabel>
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
                  <FormDescription>
                    This is the amount of money you want to transfer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 text-md" loading={isLoading}>
              {isLoading ? "Transferring..." : "Transfer"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
