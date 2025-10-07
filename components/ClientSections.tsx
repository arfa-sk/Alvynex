"use client"

import dynamic from "next/dynamic"

const Work = dynamic(() => import("@/components/work"), { ssr: false, loading: () => null })
const PricingSection6 = dynamic(() => import("@/components/pricing-section-4"), { ssr: false, loading: () => null })
const CEO = dynamic(() => import("@/components/ceo"), { ssr: false, loading: () => null })
const Contact = dynamic(() => import("@/components/contact"), { ssr: false, loading: () => null })
const Footer = dynamic(() => import("@/components/footer"), { ssr: false, loading: () => null })

export default function ClientSections() {
  return (
    <>
      <Work />
      <PricingSection6 />
      <CEO />
      <Contact />
      <Footer />
    </>
  )
}


