import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/passwordInput";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"; // Import the toast hook
import { login } from "@/api/auth"; // Import the login API function
import { useUser } from "@/contexts/useUser";
// import { useNavigate } from "react-router-dom";

// Define schema for validation
const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Please enter your username" })
    .min(4, { message: "Username must contain at least 5 characters" }),

  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
});

export function UserAuthForm({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { setUserLevels, setToken, setUserType } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Destructure toast from useToast hook

  // const navigate = useNavigate();

  // Initialize form with zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission and login logic
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Call the login API
      const response = await login(data);

      // Store token in localStorage or handle as needed
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem(
        "userLevels",
        JSON.stringify(response.user.levels),
      );

      const userType = response.user.customer
        ? response.user.customer.type
        : "employee";
      sessionStorage.setItem("userType", userType);

      setToken(response.token);
      setUserLevels(response.user.levels);
      setUserType(userType);

      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "default",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Show error toast if login fails
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john_doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2 text-md" loading={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
