"use client"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
    children: React.ReactNode
    session?: any
}

export function SessionProvider({ children, session }: Props ) {
    return(
        <NextAuthSessionProvider session={session}>
            {children}
        </NextAuthSessionProvider>
    )
}