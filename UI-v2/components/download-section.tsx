"use client"

import { Check, ArrowRight, Globe, Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DownloadSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-black crypto-blur-bg">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="relative">
          {/* Paper airplane icon in top right */}
          <div className="absolute top-0 right-0 -mt-16 md:-mt-24 lg:-mt-16 -mr-4 md:-mr-10 lg:-mr-4 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <ArrowRight className="w-16 h-16 md:w-20 md:h-20 text-primary transform rotate-45" />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4 crypto-gradient-text">
              GET STARTED FOR FREE
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Install and set up your Smart Wallet self-custodial blockchain wallet today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Browser Extension */}
            <div className="crypto-card-highlight hover-scale">
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Browser extension</h3>
                    <p className="text-gray-400">Chrome, Brave, Opera, Edge</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>BTC, STX, Ordinals, BRC-20, Stamps</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Connect to Web3 apps</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Buy tokens</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Trade on decentralized marketplaces</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Secure assets with Ledger</span>
                  </li>
                </ul>

                <Button className="w-full py-6 text-base crypto-button">Install extension</Button>
              </div>
            </div>

            {/* Desktop App */}
            <div className="crypto-card-highlight hover-scale">
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Desktop app</h3>
                    <p className="text-gray-400">Windows, macOS, Linux</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Receive, store, and send STX tokens</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Secure assets with Ledger</span>
                  </li>
                  <li className="flex items-start opacity-40">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>More features coming soon</span>
                  </li>
                </ul>

                <Button className="w-full py-6 text-base crypto-button">Install desktop app</Button>
              </div>
            </div>

            {/* Mobile App */}
            <div className="crypto-card-highlight hover-scale">
              <div className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Mobile app</h3>
                    <p className="text-gray-400">iOS and Android</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>BTC, STX, Ordinals, BRC-20, Stamps</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Connect to Web3 apps</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Buy tokens</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Trade on decentralized marketplaces</span>
                  </li>
                </ul>

                <Button className="w-full py-6 text-base" variant="secondary" disabled>
                  Coming soon!
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
