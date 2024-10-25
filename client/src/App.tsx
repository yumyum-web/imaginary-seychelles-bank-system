import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./themes/themeProvider";
import router from "./routes/router";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
