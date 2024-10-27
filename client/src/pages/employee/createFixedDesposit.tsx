import { useState } from "react"; // Import useState hook
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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

// Updated plans array with the minimum property
const plans = [
  { value: "1", label: "6 months", constraint: "6 months 13%" },
  { value: "2", label: "1 year", constraint: "1 year 14%" },
  {
    value: "3",
    label: "3 years",
    constraint: "3 years 15%",
  },
] as const;

// Define form schema
const formSchema = z.object({
  customer_id: z.string().min(1, { message: "Customer ID is required." }),
  account_id: z.string().min(1, { message: "Savings Account is required" }),
  account_plan: z
    .string()
    .min(1, { message: "Please select an account plan." }),
  deposit: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Initial deposit must be a number.",
      })
      .min(0, { message: "Initial deposit must be a positive number." }),
  ),
});

export function CreateFixedDeposit() {
  const [planDescription, setPlanDescription] = useState(""); // State for plan description

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      account_id: "",
      account_plan: "",
      deposit: "",
    },
  });

  // Submit handler
  function onSubmit() {
    console.log("Form submitted with data:");
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
              name="account_plan"
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
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? plans.find((plan) => plan.value === field.value)
                                ?.label
                            : "Select plan"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search plan..." />
                        <CommandList>
                          <CommandEmpty>No plan found.</CommandEmpty>
                          <CommandGroup heading="Plans">
                            {plans.map((plan) => (
                              <CommandItem
                                value={plan.label}
                                key={plan.value}
                                onSelect={() => {
                                  form.setValue("account_plan", plan.value);
                                  setPlanDescription(plan.constraint); // Set plan description
                                  console.log(
                                    "Account Plan set to:",
                                    plan.value,
                                  );
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    plan.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {plan.label}
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

            <Button type="submit">Create FD</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
