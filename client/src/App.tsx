import "./App.css";
import SignIn from "./pages/auth/signIn";
import { ThemeProvider } from "./themes/themeProvider";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SignIn />
      </ThemeProvider>
    </>
  );
}

export default App;
