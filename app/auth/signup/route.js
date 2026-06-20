import { connectDB } from "../../../lib/db";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";
import User from "../../../lib/models/User";
import { generateToken } from "../../../lib/auth";

export async function POST(request){
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        if( !name || !email || !password ){
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            )
        }

        const existing = await User.findOne({ email });

        if(existing){
            return NextResponse.json(
                { error: "Email already registered." },
                { status: 409 }
            )
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: hashed
        });

        const token = await generateToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const response = NextResponse.json(
            {
                message: "Signup successful",
                user: {id: user._id, name: user.name, email: user.email}
            },
            { status: 201 }
        );

        response.cookies.set("next-js-blog", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return response;

    } catch (error) {
        console.log("Signup error:", error);

        return NextResponse.json(
            {
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}