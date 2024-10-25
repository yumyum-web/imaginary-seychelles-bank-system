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
  account_plan: z
    .string()
    .min(1, { message: "Please select an account plan." }),
  initial_deposit: z
    .number()
    .min(0, { message: "Initial deposit must be a positive number." }),
});

export function CreateSavingsAccount() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: "",
      account_plan: "",
      initial_deposit: 0,
    },
  });

  // Submit handler
  function onSubmit() {
    console.log("Done");
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
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex w-full p-1 pr-4 md:overflow-y-hidden">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Create Savings Account
            </h1>
            <p className="text-muted-foreground">
              Create a new savings account for a customer
            </p>
          </div>
          <Separator className="my-4 lg:my-6" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer ID Field */}
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Customer ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Account Plan Dropdown */}
              <FormField
                control={form.control}
                name="account_plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Plan</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Initial Deposit Amount Field */}
              <FormField
                control={form.control}
                name="initial_deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Deposit Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter initial deposit"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit">Create Account</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
