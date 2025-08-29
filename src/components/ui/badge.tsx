import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        R1:
          "bg-gradient-to-r from-[#B0C4DE] via-[#AFEEEE] to-[#a8f720] border-transparent text-r1-foreground shadow hover:bg-gradient-to-r hover:from-[#B0C4DE] hover:via-[#AFEEEE] hover:to-[#a8f720]/80",
        R2:
          "bg-gradient-to-r from-[#00BFFF] via-[#7FFFD4] to-[#ADFF2F] border-transparent text-r2-foreground shadow hover:bg-gradient-to-r hover:from-[#00BFFF] hover:via-[#7FFFD4] hover:to-[#ADFF2F]/80",
        R3:
          "bg-gradient-to-r from-[#D3D3D3] via-[#98FF98] to-[#8FBC8F] border-transparent text-r3-foreground shadow hover:bg-gradient-to-r hover:from-[#D3D3D3] hover:via-[#98FF98] hover:to-[#8FBC8F]/80",
        R4:
          "bg-gradient-to-r from-[#FFA500] via-[#FFD700] to-[#ADFF2F] border-transparent text-r4-foreground shadow hover:bg-gradient-to-r hover:from-[#FFA500] hover:via-[#FFD700] hover:to-[#ADFF2F]/80",
        leader:
          "bg-gradient-to-r from-[#FFD700] via-[#c56d1a] to-[#a70d40] border-transparent text-leader-foreground shadow hover:bg-gradient-to-r hover:from-[#FFD700] hover:via-[#c56d1a] hover:to-[#a70d40]/80",
        officer:
          "bg-gradient-to-r from-[#FF7F50] via-[#FF4500] to-[#8B0000] border-transparent text-officer-foreground shadow hover:bg-gradient-to-r hover:from-[#FF7F50] hover:via-[#FF4500] hover:to-[#8B0000]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
