import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { rejects } from "assert"
import { resolve } from "path"
import { JSX, useState } from "react"
export const useConfirm = (
  title: string,
  messages: string
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

  const confirm = () => new Promise((resolve, reject) => {
    setPromise({ resolve })
  })

  const handlerClose = () => {
    promise?.resolve(false)
    setPromise(null)
  }
  const handlerCancel = () => {
    promise?.resolve(false)
    handlerClose()
  }
  const handlerConfirm = () => {
    promise?.resolve(true)
    handlerClose()
  }

  const ConfirmDialog = () => (
    <Dialog open={promise !== null} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{messages}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handlerCancel} variant='outline'>取消</Button>
          <Button onClick={handlerConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
  return [ConfirmDialog, confirm]
}