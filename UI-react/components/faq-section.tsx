"use client"

import { useState } from "react"
import { ArrowRight, Book, Code, HelpCircle, Plus, MessageCircleQuestionIcon as QuestionMarkCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What is Smart Wallet?",
    answer:
      "Smart Wallet is a self-custodial blockchain wallet that allows you to securely store, send, and receive digital assets. It provides enhanced security features like key rotation and recovery mechanisms without requiring you to transfer your assets.",
  },
  {
    question: "What can I do with my Smart Wallet account?",
    answer:
      "With your Smart Wallet account, you can manage various digital assets, connect to Web3 applications, set up security features like daily transfer limits, rotate your keys for enhanced security, and recover your wallet in case of key loss.",
  },
  {
    question: "What are the system requirements for running Smart Wallet?",
    answer:
      "Smart Wallet is available as a browser extension for Chrome, Brave, Opera, and Edge. A desktop application is available for Windows, macOS, and Linux. Mobile applications for iOS and Android are coming soon.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-black crypto-blur-bg">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter crypto-gradient-text">
              FREQUENTLY
              <br />
              ASKED
              <br />
              QUESTIONS
            </h2>

            {/* FAQ icon */}
            <div className="absolute bottom-0 right-0 md:right-12 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              <div className="relative">
                <HelpCircle className="w-20 h-20 md:w-24 md:h-24 text-primary/50" />
                <QuestionMarkCircle className="w-10 h-10 absolute top-1/4 right-1/4 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="crypto-card-glow border-t border-gray-800 pt-6">
                <button className="flex justify-between items-center w-full text-left" onClick={() => toggleFAQ(index)}>
                  <h3 className="text-xl font-medium">{faq.question}</h3>
                  <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-800">
                    <Plus className={`h-4 w-4 transition-transform ${openIndex === index ? "rotate-45" : ""}`} />
                  </div>
                </button>
                {openIndex === index && (
                  <div className="mt-4 text-gray-400">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-gray-800 pt-6">
              <Link href="/docs" className="flex items-center text-primary hover:underline">
                <span>Visit our FAQs for more</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Resources section */}
        <div className="mt-24 grid md:grid-cols-3 gap-6">
          <div className="crypto-card-highlight hover-scale">
            <Book className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Guides</h3>
            <p className="text-gray-400 mb-4">Explore our detailed user materials</p>
            <Link href="/docs">
              <Button variant="outline" className="crypto-button-outline">
                Learn more
              </Button>
            </Link>
          </div>

          <div className="crypto-card-highlight hover-scale">
            <Code className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Developer Docs</h3>
            <p className="text-gray-400 mb-4">Power your app with Smart Wallet APIs</p>
            <Link href="/docs">
              <Button variant="outline" className="crypto-button-outline">
                Learn more
              </Button>
            </Link>
          </div>

          <div className="crypto-card-highlight hover-scale">
            <HelpCircle className="h-8 w-8 mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Expert Support</h3>
            <p className="text-gray-400 mb-4">Get help from our team around the clock</p>
            <Link href="/support">
              <Button variant="outline" className="crypto-button-outline">
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
