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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema
const formSchema = z.object({
  customer_id: z.string().min(1, { message: "Customer ID is required." }),
  account_id: z.string().min(1, { message: "Account ID is required." }),
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
      .min(0, { message: "aAmount must be a positive number." }),
  ),
});

export function CreateLoanRequest() {
  // State for plan description

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      account_id: "",
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
          Create Loan Request
        </h1>
        <p className="text-muted-foreground">
          Create a new loan request for a customer
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 lg:flex-row md:overflow-auto lg:space-x-12 lg:space-y-0 md:px-6 lg:px-10 no-scrollbar">
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
                    new loan request.
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
                  <FormLabel>Enter Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the account ID of the customer you want to create a
                    new loan request.
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
                    The purpose of the loan request.
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

            <Button type="submit">Request Loan</Button>
          </form>
        </Form>
      </div>
    </>
  );
}
