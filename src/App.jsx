import { HeroUIProvider } from "@heroui/react";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";


function App() {

  return (
    <HeroUIProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </HeroUIProvider>

  );
}

export default App;
