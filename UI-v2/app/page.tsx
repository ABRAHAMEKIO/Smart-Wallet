import Link from "next/link"
import { ArrowRight, Shield, Key, Wallet, ExternalLink, Zap, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { DownloadSection } from "@/components/download-section"
import { FAQSection } from "@/components/faq-section"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b border-gray-800 crypto-blur-bg">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-3 w-3 mr-1" /> Next Generation Wallet
                  </Badge>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none crypto-gradient-text">
                    Deploy Smart Wallets with
                    <br />
                    Ease and Confidence
                  </h1>
                  <p className="max-w-[600px] text-gray-400 md:text-xl">
                    Seamless. Secure. Scalable.
                    <br />
                    Start your blockchain journey with tools designed to empower every user.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="inline-flex h-12 items-center justify-center rounded-md crypto-button px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button
                      variant="outline"
                      className="inline-flex h-12 items-center justify-center rounded-md crypto-button-outline px-8 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Documentation
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full overflow-hidden rounded-xl crypto-card-highlight p-6 shadow-lg">
                  <div className="absolute inset-0 bg-grid-white/5 bg-[bottom_1px_right_1px] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
                  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <Wallet className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 crypto-gradient-text">Smart Contract Wallet</h2>
                    <p className="max-w-md text-gray-400">
                      A secure smart contract solution designed to hold assets in the name of one or more users,
                      enhancing both security and usability.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 animated-gradient-bg">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl crypto-gradient-text">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our Smart Wallet provides a range of features to enhance your asset management experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center crypto-card-highlight p-6 rounded-xl hover-scale">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Key className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Key Rotation</h3>
                  <p className="text-gray-400">
                    Update or change private keys without needing to manually transfer each asset individually.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center crypto-card-highlight p-6 rounded-xl hover-scale">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Wallet className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Asset Management</h3>
                  <p className="text-gray-400">
                    Conduct operations such as sending, staking, and managing assets within the smart wallet
                    environment.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center crypto-card-highlight p-6 rounded-xl hover-scale">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Enhanced Security</h3>
                  <p className="text-gray-400">
                    Set transfer limits and recovery mechanisms to protect your assets from unauthorized access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add the new Download Section */}
        <DownloadSection />

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black border-t border-gray-800 crypto-blur-bg">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">
                  <Zap className="h-3 w-3 mr-1" /> Powerful & Simple
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl crypto-gradient-text">
                  Smart Wallet for the Rest of Us
                </h2>
                <p className="text-gray-400 md:text-xl">
                  Smart Wallet is the only wallet you need to tap into the multilayered blockchain economy
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="inline-flex h-12 items-center justify-center rounded-md crypto-button px-8 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                      Install Smart Wallet
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl crypto-card-highlight p-6 shadow-lg">
                  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                    <div className="text-4xl font-bold mb-6 crypto-gradient-text">Choose Asset to Receive</div>
                    <div className="flex gap-6">
                      <div className="token-icon token-icon-stx h-16 w-16 flex items-center justify-center hover-scale">
                        <span className="text-primary font-bold text-xl">STX</span>
                      </div>
                      <div className="token-icon token-icon-mno h-16 w-16 flex items-center justify-center hover-scale">
                        <span className="text-blue-400 font-bold text-xl">MNO</span>
                      </div>
                      <div className="token-icon token-icon-btc h-16 w-16 flex items-center justify-center hover-scale">
                        <span className="text-yellow-500 font-bold text-xl">BTC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add the new FAQ Section */}
        <FAQSection />
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">© 2025 Smart Wallet. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-gray-500 hover:text-gray-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-gray-500 hover:text-gray-400" href="#">
            Privacy
          </Link>
          <Link
            className="text-xs text-gray-500 hover:text-gray-400"
            href="https://polimartlabs.gitbook.io/smart-wallet"
            target="_blank"
            rel="noreferrer"
          >
            Docs <ExternalLink className="h-3 w-3 inline" />
          </Link>
        </nav>
      </footer>
    </div>
  )
}
