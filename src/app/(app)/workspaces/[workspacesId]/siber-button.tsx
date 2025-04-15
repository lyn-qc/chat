import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { IconType } from "react-icons/lib"

interface SidebarButtonProps {
    icon: LucideIcon|IconType,
    label: string,
    isActive: boolean,
}

export const SidebarButton = ({
    icon:Icon,
    label,
    isActive,
}: SidebarButtonProps) => {
    return (
        <div className={`flex flex-col items-center cursor-pointer gap-1}`}>
            <Button
             variant='ghost'
             className={cn(
                "size-9 p-2",
                isActive && "bg-accent/20"
             )}
            >
                <Icon className="size-5 text-white  transition-all" />
            </Button>
            <span className="text-[11px] text-white group-hover:text-accent">
                {label}
            </span>
        </div>
    )
}