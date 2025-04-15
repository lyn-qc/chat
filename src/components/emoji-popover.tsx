import EmojiPicker from 'emoji-picker-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react";

interface EmojiPopoverProps {
  children: React.ReactNode
  hint?: string
  onEmojiSelect: (emoji: any) => void;
}
export default function EmojiPopover({
  children,
  hint,
  onEmojiSelect,
}: EmojiPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooltipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              {children}
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <EmojiPicker
            width="100%"
            height={400}
            onEmojiClick={(emoji) => {
              onEmojiSelect(emoji);
              setPopoverOpen(false);
              setTooltipOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
