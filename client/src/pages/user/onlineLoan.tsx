import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
//import { cn } from "@/lib/utils";
//import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
/*import {
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
} from "@/components/ui/command";*/
import onlineLoanRequestAPI from "@/api/onlineloan";
import { useToast } from "@/hooks/use-toast";
// Define form schema
enum LoanType {
  Business = "Business",
  Personal = "Personal",
}
// Dummy account IDs for selection
/*const dummyAccounts = [
  { id: "ACC123456", label: "Account 123456" },
  { id: "ACC654321", label: "Account 654321" },
  { id: "ACC112233", label: "Account 112233" },
];*/
// Define form schema
const formSchema = z.object({
  FDId: z.preprocess(
    (value) => Number(value),
    z.number().positive({ message: "FD ID must be a positive number." }),
  ),
  savingsAccountId: z.preprocess(
    (value) => Number(value),
    z
      .number()
      .positive({ message: "Savings Account ID must be a positive number." }),
  ),
  loanType: z.enum([LoanType.Business, LoanType.Personal], {
    required_error: "Loan type is required.",
  }),
  purpose: z
    .string()
    .min(10, { message: "Purpose must be at least 10 characters." }),
  amount: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Amount must be a number.",
      })
      .min(0, { message: "Amount must be a positive number." }),
  ),
  timePeriod: z.preprocess(
    (value) => Number(value), // Ensure timePeriod is converted to a number
    z
      .number({
        invalid_type_error: "Time Period must be a number.",
      })
      .min(1, { message: "Time period must be at least 1 month." }),
  ),
});

export function OnlineLoan() {
  // State for plan description
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      FDId: 123,
      savingsAccountId: 100,
      loanType: LoanType.Business,
      purpose: "",
      amount: 1,
      timePeriod: 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onlineLoanRequestAPI(data);
      toast({
        title: "Success",
        description: "Online loan has been approved!",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to approve online loan:", error);
      toast({
        title: "Error",
        description: "Failed to approve online loan due to insufficient funds.",
        variant: "destructive",
      });
    }
  };

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
              name="FDId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Fixed Deposit ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer" {...field} />
                  </FormControl>
                  <FormDescription>
                    Fixed Deposit ID required for online loan application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="savingsAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Savings Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer" {...field} />
                  </FormControl>
                  <FormDescription>
                    Savings Account Id required for online loan application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loanType"
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

            <Button type="submit">Apply Loan</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
