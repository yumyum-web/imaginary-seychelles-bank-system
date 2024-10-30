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
import { SavingsAccountPlan } from "@/api/types";
import { getSavingsAccountPlans } from "@/api/plans";
import { createSavingsAccount } from "@/api/create";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  customer_id: z.string().min(1, { message: "Customer ID is required." }),
  plan_id: z.string().min(1, { message: "Please select an account plan." }),
  initial_deposit: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Initial deposit must be a number.",
      })
      .min(0, { message: "Initial deposit must be a positive number." }),
  ),
});

export function CreateSavingsAccount() {
  const [planDescription, setPlanDescription] = useState("");
  const [savingsAccPlans, setSavingsAccPlans] = useState<SavingsAccountPlan[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSavingsAccountPlans = async () => {
      try {
        const plans = await getSavingsAccountPlans();
        setSavingsAccPlans(plans);
      } catch (error) {
        console.error("Error fetching savings account plans:", error);
      }
    };
    fetchSavingsAccountPlans();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      plan_id: "",
      initial_deposit: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const message = await createSavingsAccount(
        parseInt(data.customer_id),
        parseInt(data.plan_id),
        data.initial_deposit,
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
          Create Savings Account
        </h1>
        <p className="text-muted-foreground">
          Create a new savings account for a customer
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0 md:px-6 lg:px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            " justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? savingsAccPlans.find(
                                (plan) => plan.id === Number(field.value),
                              )?.name
                            : "Select plan"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput placeholder="Search plan..." />
                        <CommandList>
                          <CommandEmpty>No plan found.</CommandEmpty>
                          <CommandGroup heading="Plans">
                            {savingsAccPlans.map((plan) => (
                              <CommandItem
                                value={plan.id.toString()}
                                key={plan.id}
                                onSelect={() => {
                                  form.setValue("plan_id", plan.id.toString()); // Set the plan ID
                                  setPlanDescription(
                                    "Minimum balance: LKR." +
                                      plan.minimumBalance +
                                      " | Interest Rate: " +
                                      plan.interestRate * 100 +
                                      "%",
                                  );
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
                                {plan.name}
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

            {planDescription && (
              <div className="text-sm text-gray-600">
                <strong>Plan Details:</strong> {planDescription}
              </div>
            )}

            <FormField
              control={form.control}
              name="initial_deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Deposit</FormLabel>
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
                    This is the initial deposit amount for the savings account.
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
