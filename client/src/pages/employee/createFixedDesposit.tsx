import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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
import { Input } from "@/components/ui/input";
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
import { FixedDepositPlan } from "@/api/types";
import { getFixedDepositPlans } from "@/api/plans";
import { createFixedDeposit } from "@/api/create";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  customer_id: z.string().min(1, { message: "Customer ID is required." }),
  account_id: z.string().min(1, { message: "Savings Account is required" }),
  plan_id: z.string().min(1, { message: "Please select an account plan." }),
  deposit: z.preprocess(
    (value) => (typeof value === "string" ? parseFloat(value) : value),
    z
      .number({
        invalid_type_error: "Initial deposit must be a number.",
      })
      .min(1, { message: "Initial deposit must be a positive number." }),
  ),
});

export function CreateFixedDeposit() {
  const [planDescription, setPlanDescription] = useState(""); // State for plan description
  const [fixedDepositPlans, setFixedDepositPlans] = useState<
    FixedDepositPlan[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFixedDepositPlans = async () => {
      try {
        const plans = await getFixedDepositPlans();
        setFixedDepositPlans(plans);
      } catch (error) {
        console.error("Error fetching savings account plans:", error);
      }
    };
    fetchFixedDepositPlans();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      account_id: "",
      plan_id: "",
      deposit: 0,
    },
  });

  // Submit handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const message = await createFixedDeposit(
        parseInt(data.customer_id),
        data.deposit,
        parseInt(data.account_id),
        parseInt(data.plan_id),
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
          "Failed to create checkings account",
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
          Create Fixed Deposit
        </h1>
        <p className="text-muted-foreground">
          Create a new fixed deposit for a customer
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-scroll lg:flex-row lg:space-x-12 lg:space-y-0 md:px-6 lg:px-10 no-scrollbar">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer ID Field */}
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Customer ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the customer ID of the customer you want to create a
                    new savings account for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Savings Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Savings Account" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the customer ID of the customer you want to create a
                    new savings account for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Plan Field */}
            <FormField
              control={form.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Account Plan</FormLabel>
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
                            ? fixedDepositPlans.find(
                                (plan) => plan.id === Number(field.value),
                              )?.duration + " months"
                            : "Select plan"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search plan..." />
                        <CommandList>
                          <CommandEmpty>No plan found.</CommandEmpty>
                          <CommandGroup heading="Plans">
                            {fixedDepositPlans.map((plan) => (
                              <CommandItem
                                value={plan.id.toString()}
                                key={plan.id}
                                onSelect={() => {
                                  form.setValue("plan_id", plan.id.toString()); // Set the plan ID
                                  setPlanDescription(
                                    "Interest Rate: " +
                                      (plan.interestRate * 100).toFixed(2) +
                                      "%",
                                  ); // Set plan description
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    plan.id === Number(field.value)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {plan.duration + " months"}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the account plan for the savings account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Selected Plan Description */}
            {planDescription && (
              <div className="text-sm text-gray-600">
                <strong>Plan Details:</strong> {planDescription}
              </div>
            )}

            {/* Initial Deposit Field */}
            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit</FormLabel>
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
                    The deposit amount for the Fixed Deposit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 text-md" loading={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
