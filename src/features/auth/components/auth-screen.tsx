'use client'

import { useState } from "react"
import { SignInFlow } from "./type"
import { SignInCard } from "./sign-in-card"
import { SignUpCard } from "./sign-up-card"
export default function Authscreen() {
    const [state, setState] = useState<SignInFlow>('signIn')
    return (
        <div className="h-full w-full flex items-center justify-center " style={{ background: "aqua" }}>
            <div className="md:h-auto md:w-[420px]">
                {state == 'signIn' ? <SignInCard setState={setState} /> : <SignUpCard setState={setState} />}
            </div>
        </div>
    )
}