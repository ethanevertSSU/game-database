import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import axios from "axios";

const prisma = new PrismaClient();

const MICROSOFT_CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET!;
const MICROSOFT_REDIRECT_URI = process.env.NEXT_PUBLIC_MICROSOFT_REDIRECT_URI!;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 },
    );
  }

  try {
    console.log("Xbox route hit with code:", req.url);
    // 1. Exchange code for tokens
    const tokenRes = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        code,
        redirect_uri: MICROSOFT_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
    );

    const { access_token } = tokenRes.data;

    // 2. Use access token to call Xbox Live sign-in
    const xblRes = await axios.post(
      "https://user.auth.xboxlive.com/user/authenticate",
      {
        Properties: {
          AuthMethod: "RPS",
          SiteName: "user.auth.xboxlive.com",
          RpsTicket: `d=${access_token}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const xblToken = xblRes.data.Token;
    const xboxUserHash = xblRes.data.DisplayClaims.xui[0].uhs;

    // 3. Connect to your app's session
    const session = await auth.api.getSession({ headers: await headers() });
    const username = session?.user.name ?? "";

    if (!session) {
      return NextResponse.redirect("/Login");
    }

    const user = await prisma.user.findFirst({ where: { name: username } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Save Xbox account in linkedAccounts table
    const existing = await prisma.linkedAccounts.findFirst({
      where: {
        externalPlatformId: xboxUserHash,
        platformName: "Xbox",
      },
    });

    if (!existing) {
      await prisma.linkedAccounts.create({
        data: {
          externalPlatformId: xboxUserHash,
          externalPlatformUserName: xboxUserHash, // you can try to fetch real username later
          platformName: "Xbox",
          user: {
            connect: { id: user.id },
          },
        },
      });
      console.log("Xbox gamertag:", xboxUserHash);
    }

    return NextResponse.redirect("/profile");
  } catch (error: any) {
    console.error("Xbox linking failed:", error.response?.data || error);
    return NextResponse.json(
      { error: "Xbox authentication failed" },
      { status: 500 },
    );
  }
}
