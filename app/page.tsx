import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
const Hero = dynamic(() => import("@/components/hero"), { ssr: true })
import ClientSections from "@/components/ClientSections"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* Client-only sections (deferred with dynamic imports inside) */}
      <ClientSections />
    </>
  )
}
