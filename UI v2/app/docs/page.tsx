import Link from "next/link"
import { Book, ExternalLink, Key, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 bg-black">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Smart Wallet Documentation</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Learn about Smart Wallet features, use cases, and implementation details.
            </p>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="nothing">Nothing Token</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">What is Smart Wallet?</h2>
                <p>
                  The Smart Wallet is an innovative smart contract solution designed to hold assets in the name of one
                  or more users. This contract offers a streamlined approach to asset management and key rotation,
                  enhancing both security and usability. It is also known as Smart Contract Wallet or Account
                  Abstraction.
                </p>
                <div className="flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex flex-col items-center text-center">
                    <Wallet className="h-16 w-16 mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">Smart Contract Wallet</h3>
                    <p className="max-w-md">
                      A secure and flexible way to manage your digital assets with enhanced security features and
                      simplified key management.
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-bold">Benefits</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enhanced security through smart contract logic</li>
                  <li>Simplified key rotation without asset transfers</li>
                  <li>Customizable security settings and limits</li>
                  <li>Recovery mechanisms for lost keys</li>
                  <li>Efficient asset management across multiple tokens</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Key className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Key Rotation</h3>
                  </div>
                  <p>
                    Update or change private keys without needing to manually transfer each asset individually, reducing
                    the complexity and transaction fees involved.
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Seamless key updates</li>
                    <li>No need to transfer assets</li>
                    <li>Reduced transaction fees</li>
                    <li>Improved security posture</li>
                  </ul>
                </div>
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Wallet className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Asset Management</h3>
                  </div>
                  <p>
                    Conduct various operations such as sending, staking, and managing assets within the smart wallet
                    environment, ensuring security and ease of use.
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Unified asset dashboard</li>
                    <li>Simplified token transfers</li>
                    <li>Staking capabilities</li>
                    <li>NFT management</li>
                  </ul>
                </div>
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Enhanced Security</h3>
                  </div>
                  <p>
                    Set transfer limits and recovery mechanisms to protect your assets from unauthorized access and
                    provide peace of mind.
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Daily transfer limits</li>
                    <li>Multi-signature support</li>
                    <li>Recovery addresses</li>
                    <li>Transaction approval workflows</li>
                  </ul>
                </div>
                <div className="space-y-4 rounded-lg border p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Book className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Documentation</h3>
                  </div>
                  <p>
                    Comprehensive documentation and guides to help you get the most out of your Smart Wallet
                    implementation.
                  </p>
                  <div className="pt-2">
                    <Link href="https://polimartlabs.gitbook.io/smart-wallet" target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full">
                        View Official Documentation
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="nothing" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">The Nothing Token ($MNO)</h2>
                <p>
                  The Nothing token, also known as micro-nothing ($MNO), was created at block 5235 in the Stacks (STX)
                  ecosystem. It was the first usable coin in the ecosystem before the SIP-010 standard existed. $MNO had
                  a max supply of 100 trillion tokens, all minted at deployment and distributed among different
                  addresses.
                </p>
                <div className="rounded-lg border p-6 space-y-4">
                  <h3 className="text-xl font-bold">Token Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Name</h4>
                      <p>Micro-Nothing ($MNO)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Created At</h4>
                      <p>Block 5235 (Stacks)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Max Supply</h4>
                      <p>100 Trillion Tokens</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Standard</h4>
                      <p>Pre-SIP-010</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold">Integration with Smart Wallet</h3>
                <p>
                  The Nothing token serves as an excellent example of how the Smart Wallet can manage various token
                  types, including those created before standardization. The Smart Wallet can hold, transfer, and manage
                  $MNO tokens just like any other asset, demonstrating its flexibility and compatibility with different
                  token implementations.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="italic">
                    "The Nothing token was one of the first experiments in the Stacks ecosystem, and its integration
                    with Smart Wallet showcases the wallet's ability to handle diverse asset types regardless of when or
                    how they were created."
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="technical" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Technical Implementation</h2>
                <p>
                  The Smart Wallet is implemented as a smart contract on the Stacks blockchain. It leverages the
                  security and programmability of blockchain technology to provide advanced features for asset
                  management and security.
                </p>
                <div className="rounded-lg border p-6 space-y-4">
                  <h3 className="text-xl font-bold">Smart Contract Architecture</h3>
                  <p>The Smart Wallet contract consists of several key components:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Owner Management:</strong> Functions to manage wallet ownership and key rotation
                    </li>
                    <li>
                      <strong>Asset Management:</strong> Functions to handle different types of assets (tokens, NFTs)
                    </li>
                    <li>
                      <strong>Security Controls:</strong> Implementation of limits, multi-signature requirements, and
                      recovery mechanisms
                    </li>
                    <li>
                      <strong>Interface Layer:</strong> APIs for interacting with the wallet from external applications
                    </li>
                  </ul>
                </div>
                <h3 className="text-xl font-bold">Implementation Guide</h3>
                <p>To implement a Smart Wallet in your application, follow these general steps:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Deploy the Smart Wallet contract to the blockchain</li>
                  <li>Initialize the wallet with owner keys and security parameters</li>
                  <li>Integrate the wallet interface with your application</li>
                  <li>Test all functionality thoroughly before moving to production</li>
                  <li>Implement monitoring and alerts for security events</li>
                </ol>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">For detailed technical documentation:</p>
                  <Link
                    href="https://polimartlabs.gitbook.io/smart-wallet"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center mt-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit the official Smart Wallet technical documentation
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t border-gray-800 bg-black px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:h-10 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 Smart Wallet. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://polimartlabs.gitbook.io/smart-wallet"
              className="text-sm text-gray-500 hover:text-gray-400 underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Documentation <ExternalLink className="ml-1 h-3 w-3 inline" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
