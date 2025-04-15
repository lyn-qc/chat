import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Separator } from "@/components/ui/separator"
import { SignInFlow } from "./type"
import { useState } from "react"
import { TriangleAlert } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"
interface SignUpCardProps {
  setState: (state: SignInFlow) => void
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const { signIn } = useAuthActions()
  const onPasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== repassword) {
      setError("密码不匹配")
      return
    }
    setPending(true)
    signIn("password", { name, email, password, flow: "signUp" })
      .catch(() => {
        setError("无效的邮箱或密码")
      })
      .finally(() => {
        setPending(false)
      })
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>SignUp</CardTitle>
        <CardDescription>Ready to go? Log in to get started!</CardDescription>
      </CardHeader>
      {
        !!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm">
            <TriangleAlert className="size-4"></TriangleAlert>
            <p>{error}</p>
          </div>
        )
      }
      <CardContent className="space-y-5">
        <form className="space-y-2.5" onSubmit={onPasswordSignUp}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="Email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="repassword">RequirePassword</Label>
              <Input id="repassword" type="password" value={repassword} onChange={(e) => { setRepassword(e.target.value) }} required placeholder="require password" />
            </div>
          </div>
          <Button type="submit" className="w-full" size='lg' disabled={pending} >SignUp</Button>
        </form>

        <Separator></Separator>
        <div className="space-y-5">
          <Button type="submit" className="w-full m-auto" size='lg' disabled={false}>
            <FcGoogle></FcGoogle>
            Continue with Google
          </Button>
          <Button type="submit" className="w-full m-auto mt-3" size='lg' disabled={false}>
            <FaGithub></FaGithub>
            Continue with Github
          </Button>
          <p className="text-center text-sm  text-sky-500 hover:underline cursor-s-resize mt-3"
            onClick={() => {
              setState('signIn')
            }}
          >Sign In</p>
        </div>
      </CardContent>

    </Card>
  )
}