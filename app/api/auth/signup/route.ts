import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { signupSchema } from "@/src/lib/validations/auth";                           
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
    try {
        // parse JSON from the request body
        const body = await request.json();

        const validated = signupSchema.safeParse(body);

        if (!validated.success) {
            // failed validation: error must be returned
            return NextResponse.json(
                // JSON response with error details
                { error: "Invalid input", details: validated.error.issues},

                { status: 400 }
            );

        }

        const { name, email, password } = validated.data;

        // check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            //user exists, send another JSON response
            return NextResponse.json(
                { error: "User with this email already exists."},
                {status: 400}                
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,

            },
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during signup:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500}
        );
    }
}
