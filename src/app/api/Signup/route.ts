import { PrismaClient } from "@prisma/client";
import {NextResponse} from "next/server";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const validEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const prisma = new PrismaClient();
export async function POST(req: Request) {
    try {
        const { email, username, password, retype } = await req.json();
        const checkUsername = await prisma.account.findFirst({ where: { username } });
        const checkEmail = await prisma.account.findFirst({ where: { email } });
        if (!username || !password || !email || !retype) {
            return NextResponse.json({ error: "Please Fill Out All Fields" }, {status: 400});
        }
        if(!validEmail(email)) {
            return NextResponse.json({ error: "Email Is Not Valid" }, {status: 400});
        }
        if(checkUsername) {
           return NextResponse.json({ error: "Username Already Taken" }, {status: 400});
        }if(checkEmail) {
            return NextResponse.json({ error: "Email already taken" }, {status: 400});
        }if(password !== retype) {
            return NextResponse.json({ error: "Passwords do not match" }, {status: 400});
        }

        const hash: string = bcrypt.hashSync(password.toString(), saltRounds);

        const newUser = await prisma.account.create({
            data: { email ,username, password:hash },
        });
        console.log("created new user successfully");
        return NextResponse.json({ success: true, user: newUser }, { status: 201 });

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: "Internal Server Error, Try Again Later" }, { status: 500 });
    }
}

