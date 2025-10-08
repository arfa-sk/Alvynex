"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import clsx from "clsx"
import { Briefcase, Wrench, Info, Mail } from "lucide-react"

/* eslint-disable @typescript-eslint/no-explicit-any */
type NavItem = { name: string; href: string; icon: React.FC<any> }

const NAV_ITEMS: NavItem[] = [
  { name: "Process", href: "#pricing", icon: Briefcase },
  { name: "Portfolio", href: "#work", icon: Wrench },
  { name: "About", href: "#ceo", icon: Info },
  { name: "Contact", href: "#contact", icon: Mail },
]

export default function Navbar(): JSX.Element {
  const [active, setActive] = useState<string>(NAV_ITEMS[0].name)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      // Hide navbar after leaving hero (~90vh)
      const hideAfter = Math.max(window.innerHeight * 0.9, 560)
      setVisible(y < hideAfter)
    }
    onResize()
    onScroll()
    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll)
    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <header className={clsx(
      "fixed top-0 left-0 right-0 z-40 transition-transform duration-300 pointer-events-none",
      visible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div
        className={clsx(
          "mx-auto flex max-w-7xl items-center justify-between px-6 py-4 transition-colors",
          scrolled ? "bg-black/70 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <Link href="/" className="pointer-events-auto">
          <Image
            src="/images/logo.png"
            alt="Alvynex"
            width={160}
            height={60}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Floating pill nav (bottom-right on mobile, inline on desktop) */}
        <div className={clsx(
          "fixed bottom-4 right-4 z-50 w-auto sm:static sm:right-auto",
          !visible && "opacity-0 pointer-events-none"
        )}>
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border/50 bg-background/10 px-1 py-1 backdrop-blur-md shadow-lg">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const activeTab = active === item.name
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setActive(item.name)}
                  className={clsx(
                    "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-sans font-semibold transition-colors",
                    "text-foreground/80 hover:text-primary",
                    activeTab && "text-primary"
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden"><Icon size={18} strokeWidth={2.5} /></span>
                  {activeTab && (
                    <motion.span
                      layoutId="navLamp"
                      className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
