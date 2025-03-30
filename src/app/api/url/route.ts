import { NextResponse } from "next/server";

export async function GET() {
  const returnURL = process.env.BETTER_AUTH_URL;
  console.log(returnURL);
  return NextResponse.json({ url: returnURL });
}
