import { UserAuthForm } from "@/components/forms/signIn";

export default function SignIn() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center lg:grid lg:grid-cols-2 lg:px-0 md:px-8">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            A Bank
          </div>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="mx-auto max-w-md space-y-8 px-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
              Login to your Account
            </h1>
            <p className="text-muted-foreground">
              Login to your account using username and password
            </p>
          </div>

          <UserAuthForm />
          <div className="text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a className="underline text-muted-foreground" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline text-muted-foreground" href="#">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </>
  );
}
