"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AuthContextType {
  userData: any | null
  authenticated: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  loading: boolean
}

// Mock user data to simulate Stacks authentication
const MOCK_USER_DATA = {
  profile: {
    name: "Demo User",
    stxAddress: {
      mainnet: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      testnet: "ST2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    },
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    // Simulate checking authentication status
    const checkAuth = () => {
      try {
        const isAuthenticated = localStorage.getItem("smartWalletAuthenticated") === "true"
        if (isAuthenticated) {
          setUserData(MOCK_USER_DATA)
          setAuthenticated(true)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to simulate network request
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleSignIn = async () => {
    setLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Store authentication state in localStorage
      localStorage.setItem("smartWalletAuthenticated", "true")
      setUserData(MOCK_USER_DATA)
      setAuthenticated(true)
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    try {
      // Clear authentication state
      localStorage.removeItem("smartWalletAuthenticated")
      setUserData(null)
      setAuthenticated(false)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        userData,
        authenticated,
        handleSignIn,
        handleSignOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
