"use client"

import { useRouter } from "next/navigation"
import { PlusCircle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProtectedRoute from "@/components/protected-route"
import { Navbar } from "@/components/navbar"

export default function NoWallets() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-black crypto-blur-bg">
          <Card className="crypto-card max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">No Smart Wallets</CardTitle>
              <CardDescription>
                You don't have any smart wallets yet. Create your first smart wallet to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-gray-400">
                Smart wallets provide enhanced security, multi-signature support, and advanced asset management
                features.
              </p>
              <div className="rounded-lg border border-gray-800 p-4 bg-gray-900/50">
                <h3 className="font-medium mb-2">Benefits of Smart Wallets</h3>
                <ul className="text-sm text-gray-400 space-y-2 text-left list-disc list-inside">
                  <li>Enhanced security with multi-signature support</li>
                  <li>Social recovery options if you lose access</li>
                  <li>Batch transactions to save on fees</li>
                  <li>Programmable spending limits and permissions</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full crypto-button" onClick={() => router.push("/dashboard/create-wallet")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Smart Wallet
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
