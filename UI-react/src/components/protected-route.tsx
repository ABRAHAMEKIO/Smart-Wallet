"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-provider"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if we're not loading and not authenticated
    if (!loading && !authenticated) {
      navigate("/")
    }
  }, [authenticated, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your wallet...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
