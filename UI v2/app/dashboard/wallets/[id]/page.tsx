"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Copy,
  ExternalLink,
  RefreshCw,
  Shield,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  BarChart3,
  Zap,
  Layers,
  Settings,
  PlusCircle,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/lib/auth-provider"
import { Navbar } from "@/components/navbar"

// Mock wallet data
const mockWallets = [
  {
    id: "1",
    name: "Personal Wallet",
    address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    balance: "125.75 STX",
    usdBalance: "$156.25",
    type: "Personal",
    signers: 1,
    threshold: 1,
  },
  {
    id: "2",
    name: "Business Wallet",
    address: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
    balance: "2,450.00 STX",
    usdBalance: "$3,062.50",
    type: "Multi-Signature",
    signers: 3,
    threshold: 2,
  },
  {
    id: "3",
    name: "Savings Wallet",
    address: "SP2X0TZ59D5SZ8ACQ6PEHZ72CZQB8XFGDYB5SKE5Z",
    balance: "500.00 STX",
    usdBalance: "$625.00",
    type: "Personal",
    signers: 1,
    threshold: 1,
  },
]

// Mock transaction data
const mockTransactions = [
  {
    type: "receive",
    amount: "0.25 STX",
    from: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    date: "2 hours ago",
    status: "completed",
  },
  {
    type: "send",
    amount: "0.1 STX",
    to: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
    date: "1 day ago",
    status: "completed",
  },
  {
    type: "receive",
    amount: "10 MNO",
    from: "SP2X0TZ59D5SZ8ACQ6PEHZ72CZQB8XFGDYB5SKE5Z",
    date: "3 days ago",
    status: "completed",
  },
]

export default function WalletDashboard({ params }) {
  const router = useRouter()
  const { id } = params
  const [wallet, setWallet] = useState(null)
  const [copied, setCopied] = useState(false)
  const { userData } = useAuth()

  useEffect(() => {
    // Find the wallet with the matching ID
    const foundWallet = mockWallets.find((w) => w.id === id)
    if (foundWallet) {
      setWallet(foundWallet)
    } else {
      // If wallet not found, redirect to no-wallets page
      router.push("/dashboard/no-wallets")
    }
  }, [id, router])

  const copyToClipboard = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!wallet) {
    return (
      <ProtectedRoute>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-black crypto-blur-bg">
            <div className="text-center">
              <div className="inline-block rounded-full bg-gray-800 p-3 mb-4">
                <Wallet className="h-6 w-6 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Loading wallet...</h2>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-black crypto-blur-bg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{wallet.name}</h1>
                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                  {wallet.type}
                </Badge>
              </div>
              <p className="text-gray-400">Manage your assets and transactions</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="crypto-button-outline">
                    Switch Wallet <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800">
                  {mockWallets.map((w) => (
                    <DropdownMenuItem
                      key={w.id}
                      className={`cursor-pointer ${w.id === id ? "bg-gray-800" : ""}`}
                      onClick={() => router.push(`/dashboard/wallets/${w.id}`)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{w.name}</span>
                        <span className="text-xs text-gray-400">{w.balance}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    className="cursor-pointer border-t border-gray-800 mt-1 pt-1"
                    onClick={() => router.push("/dashboard/create-wallet")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Create New Wallet</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="crypto-button-outline"
                onClick={() => router.push(`/dashboard/wallets/${id}/settings`)}
              >
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="crypto-card-highlight hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Address</CardTitle>
                <Wallet className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold truncate max-w-[180px]">{wallet.address}</div>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="hover:bg-gray-800">
                    {copied ? <span className="text-xs text-primary">Copied!</span> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    Active
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {wallet.threshold} of {wallet.signers} Signatures
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="crypto-card-highlight hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold crypto-gradient-text">{wallet.balance}</div>
                <p className="text-xs text-gray-400 mt-1">≈ {wallet.usdBalance} USD</p>
                <div className="mt-2 flex items-center">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    <Zap className="h-3 w-3 mr-1" /> Earn 5% APY
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="crypto-card-highlight hover-scale">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Protected</div>
                <p className="text-xs text-gray-400 mt-1">Recovery keys configured</p>
                <div className="mt-2 flex items-center">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <Shield className="h-3 w-3 mr-1" /> Secure
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="assets" className="space-y-4">
            <TabsList className="crypto-tab-list grid w-full grid-cols-4 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger value="assets" className="crypto-tab data-[state=active]:crypto-tab-active">
                Assets
              </TabsTrigger>
              <TabsTrigger value="send" className="crypto-tab data-[state=active]:crypto-tab-active">
                Send
              </TabsTrigger>
              <TabsTrigger value="activity" className="crypto-tab data-[state=active]:crypto-tab-active">
                Activity
              </TabsTrigger>
              <TabsTrigger value="info" className="crypto-tab data-[state=active]:crypto-tab-active">
                Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assets" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Your Assets</CardTitle>
                      <CardDescription>View and manage all assets in your Smart Wallet.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="crypto-button-outline">
                      <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                      <div className="flex items-center">
                        <div className="token-icon token-icon-stx mr-3">
                          <span className="text-primary font-bold">STX</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-medium">Stacks</div>
                          <div className="text-sm text-gray-400">STX</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{wallet.balance}</div>
                        <div className="text-sm text-gray-400">≈ {wallet.usdBalance}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                      <div className="flex items-center">
                        <div className="token-icon token-icon-mno mr-3">
                          <span className="text-blue-400 font-bold">MNO</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-medium">Micro-Nothing</div>
                          <div className="text-sm text-gray-400">MNO</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">10 MNO</div>
                        <div className="text-sm text-gray-400">≈ $0.50</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                      <div className="flex items-center">
                        <div className="token-icon token-icon-btc mr-3">
                          <span className="text-yellow-500 font-bold">BTC</span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-medium">Bitcoin</div>
                          <div className="text-sm text-gray-400">BTC</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">0.001 BTC</div>
                        <div className="text-sm text-gray-400">≈ $45.20</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors crypto-card-glow">
                      <div className="flex items-center">
                        <div className="token-icon mr-3">
                          <Layers className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="font-medium">NFT Collectibles</div>
                          <div className="text-sm text-gray-400">Digital Assets</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">2 Items</div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          View <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full crypto-button">
                    <Wallet className="mr-2 h-4 w-4" /> Deposit Assets
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="send" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Send Assets</CardTitle>
                  <CardDescription>Transfer assets from your Smart Wallet to another address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="asset">Asset</Label>
                    <select
                      id="asset"
                      className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 crypto-input"
                    >
                      <option value="stx">STX (Stacks)</option>
                      <option value="mno">MNO (Micro-Nothing)</option>
                      <option value="btc">BTC (Bitcoin)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <Input id="amount" placeholder="0.00" type="number" className="crypto-input pr-16" />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm font-medium text-gray-400">
                        STX
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex justify-between">
                      <span>Available: {wallet.balance}</span>
                      <button className="text-primary hover:underline">Max</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input id="recipient" placeholder="Enter STX address" className="crypto-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Input id="memo" placeholder="Add a note to this transaction" className="crypto-input" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="w-full p-3 rounded-lg bg-gray-900 mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Network Fee</span>
                      <span>0.0001 STX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="font-medium">0.0001 STX</span>
                    </div>
                  </div>
                  <Button className="w-full crypto-button">Send Transaction</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>View your recent transactions and activity.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="crypto-button-outline">
                      <ExternalLink className="h-4 w-4 mr-2" /> Explorer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.map((tx, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                              tx.type === "receive" ? "bg-green-500/20" : "bg-blue-500/20"
                            }`}
                          >
                            {tx.type === "receive" ? (
                              <ArrowDownRight className="h-4 w-4 text-green-400" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{tx.type === "receive" ? "Received" : "Sent"}</div>
                            <div className="text-xs text-gray-400">
                              {tx.type === "receive"
                                ? `From: ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`
                                : `To: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${tx.type === "receive" ? "text-green-400" : ""}`}>
                            {tx.type === "receive" ? "+" : "-"}
                            {tx.amount}
                          </div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" /> {tx.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full crypto-button-outline">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Wallet Information</CardTitle>
                  <CardDescription>Details about your smart wallet configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Name:</span>
                      <span className="font-medium">{wallet.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wallet Type:</span>
                      <span>{wallet.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Signers:</span>
                      <span>{wallet.signers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Required signatures:</span>
                      <span>
                        {wallet.threshold} of {wallet.signers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Creation Date:</span>
                      <span>April 5, 2025</span>
                    </div>
                  </div>
                  <Alert className="bg-gray-900 border-gray-800">
                    <Shield className="h-4 w-4 text-primary" />
                    <AlertTitle>Security Status</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      Your wallet is protected with {wallet.threshold} of {wallet.signers} multi-signature security.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full crypto-button-outline"
                    onClick={() => router.push(`/dashboard/wallets/${id}/settings`)}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Manage Wallet Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
