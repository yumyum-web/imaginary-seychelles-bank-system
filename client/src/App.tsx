import "./App.css";
import { ThemeProvider } from "./themes/themeProvider";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./contexts/userContext";
import { useRoutes } from "react-router-dom";
import routes from "./routes/router";

function App() {
  const routing = useRoutes(routes); // Pass the routes here directly

  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <UserProvider>{routing}</UserProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default App;
