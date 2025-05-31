"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/components/protected-route"
import { Navbar } from "@/components/navbar"

// Preset wallet configurations
const presets = [
  {
    id: "personal",
    name: "Personal Wallet",
    description: "Simple single-signature wallet for personal use",
    signers: 1,
    threshold: 1,
    features: ["Single signature", "Low complexity", "Quick setup"],
    recommended: true,
  },
  {
    id: "multisig",
    name: "Multi-Signature Wallet",
    description: "Secure wallet requiring multiple approvals for transactions",
    signers: 3,
    threshold: 2,
    features: ["Multiple signers", "Enhanced security", "Shared control"],
    recommended: false,
  },
  {
    id: "business",
    name: "Business Wallet",
    description: "Advanced wallet with multiple admins and daily limits",
    signers: 5,
    threshold: 3,
    features: ["Multiple admins", "Spending limits", "Transaction policies"],
    recommended: false,
  },
]

export default function CreateWallet() {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState(presets[0])
  const [walletName, setWalletName] = useState("")
  const [signers, setSigners] = useState(1)
  const [threshold, setThreshold] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset)
    setSigners(preset.signers)
    setThreshold(preset.threshold)
  }

  const handleDeploy = () => {
    setIsDeploying(true)

    // Simulate deployment delay
    setTimeout(() => {
      // In a real app, you would call an API to deploy the wallet
      router.push("/dashboard/wallets/1")
    }, 2000)
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
              onClick={() => router.push("/dashboard/no-wallets")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Create Smart Wallet</h1>
            <p className="text-gray-400">Deploy a new smart wallet with your preferred settings</p>
          </div>

          <Tabs defaultValue="preset" className="space-y-6">
            <TabsList className="crypto-tab-list grid w-full grid-cols-2 bg-gray-900/50 p-1 rounded-lg">
              <TabsTrigger value="preset" className="crypto-tab data-[state=active]:crypto-tab-active">
                Preset Configurations
              </TabsTrigger>
              <TabsTrigger value="custom" className="crypto-tab data-[state=active]:crypto-tab-active">
                Custom Configuration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {presets.map((preset) => (
                  <Card
                    key={preset.id}
                    className={`crypto-card hover:border-primary/50 cursor-pointer transition-all ${
                      selectedPreset.id === preset.id ? "border-primary" : "border-gray-800"
                    }`}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{preset.name}</CardTitle>
                        {preset.recommended && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">Recommended</Badge>
                        )}
                      </div>
                      <CardDescription>{preset.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Signers:</span>
                          <span>{preset.signers}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Required signatures:</span>
                          <span>
                            {preset.threshold} of {preset.signers}
                          </span>
                        </div>
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {preset.features.map((feature, index) => (
                              <li key={index} className="text-xs text-gray-400 flex items-center">
                                <Check className="h-3 w-3 text-green-400 mr-2" /> {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full crypto-button-outline"
                        onClick={() => handlePresetSelect(preset)}
                      >
                        {selectedPreset.id === preset.id ? "Selected" : "Select"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <Card className="crypto-card">
                <CardHeader>
                  <CardTitle>Custom Wallet Configuration</CardTitle>
                  <CardDescription>Configure your smart wallet with custom settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-name">Wallet Name</Label>
                    <Input
                      id="wallet-name"
                      placeholder="My Smart Wallet"
                      className="crypto-input"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signers">Number of Signers</Label>
                    <Input
                      id="signers"
                      type="number"
                      min="1"
                      max="10"
                      className="crypto-input"
                      value={signers}
                      onChange={(e) => setSigners(Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-400">The total number of addresses that can sign transactions</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Required Signatures</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="1"
                      max={signers}
                      className="crypto-input"
                      value={threshold}
                      onChange={(e) => setThreshold(Number.parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-400">How many signatures are required to approve a transaction</p>
                  </div>
                  <Alert className="bg-gray-900 border-gray-800">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription className="text-gray-400">
                      Make sure you have access to all signer addresses. Lost access cannot be recovered without a
                      recovery mechanism.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 space-y-4">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle>Deployment Summary</CardTitle>
                <CardDescription>Review your wallet configuration before deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Configuration:</span>
                    <span className="font-medium">{selectedPreset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Signers:</span>
                    <span>{signers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required signatures:</span>
                    <span>
                      {threshold} of {signers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deployment fee:</span>
                    <span>0.01 STX</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full crypto-button" onClick={handleDeploy} disabled={isDeploying}>
                  {isDeploying ? (
                    <>Deploying Smart Wallet...</>
                  ) : (
                    <>
                      Deploy Smart Wallet <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
