import { PrismaClient } from "@prisma/client";
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();
export async function POST(req: Request) {
    try {
        const { identifier, password } = await req.json();

        const user = await prisma.account.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ]
            }
        });


        //let userPassword: string;



        if(!identifier || !password) {
            return NextResponse.json({ error: "Please Fill Out All Fields" }, {status: 400});
        }

        if(!user){
            return NextResponse.json({ error: "Invalid Username Or Password" }, {status: 400});
        }else {

            const passwordCheck = bcrypt.compareSync(password.toString(), user.password);

            if (!passwordCheck) {
                return NextResponse.json({error: "Invalid Username or Password"}, {status: 400});

            }
            console.log("Logged in Successfully!");
            return NextResponse.json({success: true, user: user}, {status: 201});
        }
    }catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


