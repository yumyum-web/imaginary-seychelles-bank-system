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

// Dummy account IDs for selection
const dummyAccounts = [
  { id: "ACC123456", label: "Account 123456" },
  { id: "ACC654321", label: "Account 654321" },
  { id: "ACC112233", label: "Account 112233" },
];
// Define form schema
const formSchema = z.object({
  acc_id: z.string().min(1, { message: "Account ID is required." }),
  loan_type: z.enum(["Business", "Personal"], {
    required_error: "Loan type is required.",
  }),
  purpose: z
    .string()
    .min(10, { message: "Purpose must be at least 10 characters." }),
  initial_deposit: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Amount must be a number.",
      })
      .min(0, { message: "Amount must be a positive number." }),
  ),
});

export function OnlineLoan() {
  // State for plan description

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acc_id: "",
      loan_type: "",
      purpose: "",
      amount: "",
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
              name="acc_id"
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
                            ? dummyAccounts.find(
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
                            {dummyAccounts.map((account) => (
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
                    This is the fixed deposit you apply loan for
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
