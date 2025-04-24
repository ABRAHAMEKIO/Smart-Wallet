"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { Navbar } from "@/components/navbar"
import ProtectedRoute from "@/components/protected-route"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the no-wallets page
    // In a real app, you would check if the user has wallets first
    router.push("/dashboard/no-wallets")
  }, [router])

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8 bg-black crypto-blur-bg">
          <div className="text-center">
            <div className="inline-block rounded-full bg-gray-800 p-3 mb-4">
              <Wallet className="h-6 w-6 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Loading your wallets...</h2>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
