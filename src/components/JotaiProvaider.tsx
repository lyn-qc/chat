'use client'
import { Provider } from "jotai";

interface JotaiProvaiderProps {
    children: React.ReactNode;
}

export const JotaiProvaider = ({ children }: JotaiProvaiderProps) => {
    return (
        <Provider>
            {children}
        </Provider>
    )
}