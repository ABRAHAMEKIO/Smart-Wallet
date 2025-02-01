import { HeroUIProvider } from "@heroui/react";
import AppRoutes from "./routes";


function App() {

  return (
    <HeroUIProvider>
      <AppRoutes />
    </HeroUIProvider>

  );
}

export default App;
