// ❌ Remove "use client" if you have it here

import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./globals.css"

// === Fonts ===

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

// === Metadata ===
export const metadata: Metadata = {
  title: "Alvynex",
  description: "Creative Content & Strategy Agency",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="relative min-h-[100svh] bg-black">
          {/* Performance hints for mobile */}
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          {/* Mobile-only lightweight preloads */}
          <link media="(max-width: 768px)" rel="preload" as="image" href="https://res.cloudinary.com/dud14cvre/image/upload/f_auto,q_auto/v1759841723/sf1_bpyhc8.jpg" />
          <link media="(max-width: 768px)" rel="preload" as="image" href="https://res.cloudinary.com/dud14cvre/image/upload/f_auto,q_auto/v1759844180/sf3_qnnlut.jpg" />
          <link media="(max-width: 768px)" rel="preload" as="video" href="https://res.cloudinary.com/dud14cvre/video/upload/f_auto,q_auto/v1759841723/sf1_bpyhc8.mp4" />
          <div className="pointer-events-none absolute inset-0 -z-10">
            {/* global background effects mount point */}
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
