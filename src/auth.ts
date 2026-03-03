import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema} from "@/src/lib/validations/auth";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({

            name: "credentials",

            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password"}
            },

            async authorize(credentials: Record<string, unknown>): Promise<any> {
                const validated = loginSchema.safeParse(credentials)

                if (!validated.success) {
                    return null;
                }

                const { email, password } = validated.data

                const user = await prisma.user.findUnique({

                    where: { email: email },
                });

                if (!user) {
                    return null;
                }
                
                const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

                if (!isPasswordValid) {
                    return null;
                }
                
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt"
    },

    callbacks: {
        authorized( {auth, request }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = request.nextUrl;

            if (pathname.startsWith("/dashboard")) {
                return isLoggedIn;
            }

            if (pathname === "/login" || pathname === "/signup") {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/dashboard", request.url));
                }

            }

            return true;

        },
        async jwt({ token, user}) {
            if(user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;

            }

            return token;

        },

        async session({ session, token}) {

            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    }
})