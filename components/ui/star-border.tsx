"use client"

import { ElementType, ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  innerClassName?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className,
  innerClassName,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = (as || "button") as ElementType
  const defaultColor = color || "hsl(var(--foreground))"

  return (
    <Component
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-[20px]",
        className
      )}
      {...(props as unknown as ComponentPropsWithoutRef<T>)}
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-20 dark:opacity-70"
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "relative z-1 border text-foreground text-center text-base py-4 px-6 rounded-[20px]",
          "bg-gradient-to-b from-background/90 to-muted/90 border-border/40",
          "dark:from-background dark:to-muted dark:border-border",
          innerClassName
        )}
      >
        {children}
      </div>
    </Component>
  )
}

export default StarBorder


