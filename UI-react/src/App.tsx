import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import NoWallets from "./pages/NoWallets"
import CreateWallet from "./pages/CreateWallet"
import WalletDashboard from "./pages/WalletDashboard"
import WalletSettings from "./pages/WalletSettings"
import DocsPage from "./pages/DocsPage"
import SupportPage from "./pages/SupportPage"

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/no-wallets" element={<NoWallets />} />
        <Route path="/dashboard/create-wallet" element={<CreateWallet />} />
        <Route path="/dashboard/wallets/:id" element={<WalletDashboard />} />
        <Route path="/dashboard/wallets/:id/settings" element={<WalletSettings />} />
      </Routes>
    </div>
  )
}

export default App
