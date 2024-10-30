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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { depositMoney } from "@/api/accounts";

// Define form schema
const formSchema = z.object({
  acc_id: z.string().min(1, { message: "Account ID is required." }),
  amount: z.preprocess(
    (value) => parseFloat(value as string),
    z
      .number({
        invalid_type_error: "Amount must be a number.",
      })
      .min(0, { message: "Amount must be a positive number." }),
  ),
});

export function Deposit() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      acc_id: "",
      amount: 0,
    },
  });

  // Submit handler
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const message = await depositMoney(parseInt(data.acc_id), data.amount);

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
          "Failed to withdraw money",
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
          Deposit Money
        </h1>
        <p className="text-muted-foreground">Deposit money to an account</p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0 md:px-6 lg:px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Customer ID Field */}
            <FormField
              control={form.control}
              name="acc_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Account ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Account" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the account ID of the customer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Initial Deposit Field */}
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
                    This is the amount you want to withdraw.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-2 text-md" loading={isLoading}>
              {isLoading ? "Depositing..." : "Deposit"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
