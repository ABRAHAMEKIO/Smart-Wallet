"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Users, Wallet, Trash2, AlertTriangle, Info, Lock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import ProtectedRoute from "@/components/protected-route"
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
    admins: [
      {
        name: "Primary Owner",
        address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        role: "Owner",
        added: "Apr 5, 2025",
      },
    ],
    dailyLimit: 1000,
    recoveryAddress: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
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
    admins: [
      {
        name: "CEO",
        address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        role: "Owner",
        added: "Apr 5, 2025",
      },
      {
        name: "CFO",
        address: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
        role: "Admin",
        added: "Apr 5, 2025",
      },
      {
        name: "CTO",
        address: "SP2X0TZ59D5SZ8ACQ6PEHZ72CZQB8XFGDYB5SKE5Z",
        role: "Admin",
        added: "Apr 5, 2025",
      },
    ],
    dailyLimit: 5000,
    recoveryAddress: "SP2X0TZ59D5SZ8ACQ6PEHZ72CZQB8XFGDYB5SKE5Z",
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
    admins: [
      {
        name: "Primary Owner",
        address: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
        role: "Owner",
        added: "Apr 5, 2025",
      },
    ],
    dailyLimit: 500,
    recoveryAddress: "SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE",
  },
]

export default function WalletSettings({ params }) {
  const router = useRouter()
  const { id } = params
  const [wallet, setWallet] = useState(null)
  const [walletName, setWalletName] = useState("")
  const [dailyLimit, setDailyLimit] = useState("")
  const [recoveryAddress, setRecoveryAddress] = useState("")
  const [newAdminAddress, setNewAdminAddress] = useState("")
  const [newAdminName, setNewAdminName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Find the wallet with the matching ID
    const foundWallet = mockWallets.find((w) => w.id === id)
    if (foundWallet) {
      setWallet(foundWallet)
      setWalletName(foundWallet.name)
      setDailyLimit(foundWallet.dailyLimit.toString())
      setRecoveryAddress(foundWallet.recoveryAddress)
    } else {
      // If wallet not found, redirect to no-wallets page
      router.push("/dashboard/no-wallets")
    }
  }, [id, router])

  const handleSaveGeneral = () => {
    setIsUpdating(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsUpdating(false)
      // In a real app, you would call an API to update the wallet
      setWallet((prev) => ({
        ...prev,
        name: walletName,
        dailyLimit: Number.parseInt(dailyLimit),
        recoveryAddress,
      }))
    }, 1000)
  }

  const handleAddAdmin = () => {
    if (!newAdminAddress || !newAdminName) return

    setIsUpdating(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsUpdating(false)
      // In a real app, you would call an API to add an admin
      setWallet((prev) => ({
        ...prev,
        admins: [
          ...prev.admins,
          {
            name: newAdminName,
            address: newAdminAddress,
            role: "Admin",
            added: "Apr 10, 2025",
          },
        ],
      }))
      setNewAdminAddress("")
      setNewAdminName("")
    }, 1000)
  }

  const handleRemoveAdmin = (address) => {
    setIsUpdating(true)

    // Simulate API call delay
    setTimeout(() => {
      setIsUpdating(false)
      // In a real app, you would call an API to remove an admin
      setWallet((prev) => ({
        ...prev,
        admins: prev.admins.filter((admin) => admin.address !== address),
      }))
    }, 1000)
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
              <h2 className="text-xl font-bold mb-2">Loading wallet settings...</h2>
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
        <main className="flex flex-1 flex-col p-4 md:p-8 bg-black crypto-blur-bg">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-2 text-gray-400 hover:text-white"
              onClick={() => router.push(`/dashboard/wallets/${id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Wallet
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{wallet.name} Settings</h1>
                <p className="text-gray-400">Manage your wallet configuration and security</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="crypto-tab-list grid w-full grid-cols-3 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger value="general" className="crypto-tab data-[state=active]:crypto-tab-active">
                General
              </TabsTrigger>
              <TabsTrigger value="admins" className="crypto-tab data-[state=active]:crypto-tab-active">
                Admins & Signers
              </TabsTrigger>
              <TabsTrigger value="advanced" className="crypto-tab data-[state=active]:crypto-tab-active">
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic configuration for your smart wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-name">Wallet Name</Label>
                    <Input
                      id="wallet-name"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      className="crypto-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input id="wallet-address" value={wallet.address} disabled className="crypto-input text-gray-500" />
                    <p className="text-xs text-gray-400">The wallet address cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="daily-limit">Daily Transfer Limit</Label>
                    <div className="relative">
                      <Input
                        id="daily-limit"
                        type="number"
                        className="crypto-input pr-16"
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm font-medium text-gray-400">
                        STX
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">Maximum amount that can be transferred in a 24-hour period.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full crypto-button" onClick={handleSaveGeneral} disabled={isUpdating}>
                    {isUpdating ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Recovery Settings</CardTitle>
                  <CardDescription>Configure recovery options for your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-address">Recovery Address</Label>
                    <Input
                      id="recovery-address"
                      placeholder="Enter STX address"
                      className="crypto-input"
                      value={recoveryAddress}
                      onChange={(e) => setRecoveryAddress(e.target.value)}
                    />
                    <p className="text-sm text-gray-400">Address that can recover your wallet in case of key loss.</p>
                  </div>
                  <Alert className="bg-gray-900 border-gray-800">
                    <Info className="h-4 w-4 text-blue-400" />
                    <AlertTitle>Recovery Information</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      The recovery address can initiate a recovery process after a 7-day waiting period if you lose
                      access to your wallet.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admins" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Admins & Signers</CardTitle>
                  <CardDescription>Manage who can control and sign transactions for this wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Current Admins</h3>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {wallet.admins.length} {wallet.admins.length === 1 ? "Admin" : "Admins"}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {wallet.admins.map((admin, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                              <Users className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-xs text-gray-400">
                                {admin.address.slice(0, 6)}...{admin.address.slice(-4)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                              {admin.role}
                            </Badge>
                            {admin.role !== "Owner" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={() => handleRemoveAdmin(admin.address)}
                                disabled={isUpdating}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="font-medium mb-3">Add New Admin</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="admin-name">Admin Name</Label>
                        <Input
                          id="admin-name"
                          placeholder="E.g., Finance Manager"
                          className="crypto-input"
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-address">Admin Address</Label>
                        <Input
                          id="admin-address"
                          placeholder="Enter STX address"
                          className="crypto-input"
                          value={newAdminAddress}
                          onChange={(e) => setNewAdminAddress(e.target.value)}
                        />
                      </div>
                      <Button
                        className="w-full crypto-button"
                        onClick={handleAddAdmin}
                        disabled={isUpdating || !newAdminAddress || !newAdminName}
                      >
                        <UserPlus className="mr-2 h-4 w-4" /> Add Admin
                      </Button>
                    </div>
                  </div>

                  <Alert className="bg-gray-900 border-gray-800">
                    <Shield className="h-4 w-4 text-primary" />
                    <AlertTitle>Multi-Signature Configuration</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      This wallet requires {wallet.threshold} out of {wallet.signers} signatures to approve
                      transactions.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced features and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="required-confirmations">Required Confirmations</Label>
                    <select
                      id="required-confirmations"
                      className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 crypto-input"
                      defaultValue={wallet.threshold}
                    >
                      {Array.from({ length: wallet.signers }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} of {wallet.signers} signatures
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-400">Number of signatures required to approve transactions</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time-lock">Transaction Time Lock</Label>
                    <select
                      id="time-lock"
                      className="flex h-10 w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 crypto-input"
                      defaultValue="0"
                    >
                      <option value="0">No delay</option>
                      <option value="1">1 hour</option>
                      <option value="24">24 hours</option>
                      <option value="72">3 days</option>
                    </select>
                    <p className="text-sm text-gray-400">Delay between transaction approval and execution</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whitelist">Address Whitelist</Label>
                    <Textarea
                      id="whitelist"
                      placeholder="Enter addresses, one per line"
                      className="crypto-input min-h-[100px]"
                    />
                    <p className="text-sm text-gray-400">
                      Addresses that can receive funds without additional approval
                    </p>
                  </div>

                  <Alert className="bg-yellow-900/20 border-yellow-800">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertTitle>Advanced Features</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      Changes to these settings may require multiple signatures to take effect, depending on your wallet
                      configuration.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button className="w-full crypto-button">Save Advanced Settings</Button>
                </CardFooter>
              </Card>

              <Card className="crypto-card border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border border-red-900/30 bg-red-900/10">
                    <h3 className="font-medium text-red-400 mb-2">Delete Wallet</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Permanently delete this wallet. This action cannot be undone and will require all signers to
                      approve.
                    </p>
                    <Button variant="destructive" className="w-full bg-red-900 hover:bg-red-800">
                      <Trash2 className="mr-2 h-4 w-4" /> Request Wallet Deletion
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Alert className="w-full bg-gray-900 border-gray-800">
                    <Lock className="h-4 w-4 text-red-400" />
                    <AlertTitle>Multi-Signature Required</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      Dangerous actions require approval from all wallet signers before taking effect.
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  )
}
