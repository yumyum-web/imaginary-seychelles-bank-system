import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./themes/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import router from "./routes/router";
import { UserProvider } from "./contexts/userContext";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
