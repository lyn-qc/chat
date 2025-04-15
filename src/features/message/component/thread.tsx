import { Button } from "@/components/ui/button";
import { Id } from "convex/_generated/dataModel";
import { XIcon } from "lucide-react";

interface ThreadProps {
    messageId:Id<"messages">;
    onClose:()=>void;
}

export default function Thread({messageId,onClose}:ThreadProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p>Thread</p>
        <Button size="sm" variant="ghost" onClick={onClose}
         className="width-8 h-8 rounded-full hover:bg-gray-100"
        >
            <XIcon className="size-3 stroke-[1.5]"></XIcon>
        </Button>
      </div>
    </div>
  )
}
