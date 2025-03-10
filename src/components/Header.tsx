"use client";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the session once on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/session", {
          credentials: "include", // if your auth uses cookies
        });
        if (res.ok) {
          // Logged in (session found)
          setIsLoggedIn(true);
        } else {
          // 401 or other => user is not logged in
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  // 2. Existing toast logic if user tries to access protected pages
  const handleLinkClick = (url: string) => {
    if (
      (url === "/form" || url === "/profile" || url === "/library") &&
      !isLoggedIn
    ) {
      if (document.cookie.includes("showToast=true")) {
        document.cookie = "showToast=true; Path=/; Max-Age=5; SameSite=Lax";
        toast.warning("Please Log In To Access This Page");
      }
    }
  };

  // 3. Optionally show nothing (or a loading spinner) while verifying session
  if (loading) {
    return null; // or <div>Loading...</div>;
  }

  return (
    <nav className="bg-purple-800 text-white drop-shadow-xl w-full flex items-center justify-between p-4">
      <Link href="/" className="font-bold text-xl">
        JEBBS Game Database
      </Link>
      <div className="flex space-x-4">
        {/* If logged in, show Library / Form / Profile, otherwise show Sign Up / Log in */}
        {isLoggedIn ? (
          <>
            <Link
              onClick={() => handleLinkClick("/library")}
              href="/library"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Game Library
            </Link>
            <Link
              onClick={() => handleLinkClick("/form")}
              href="/form"
              className="rounded-full border border-solid border-black/[.08] ..."
            >
              Game Form
            </Link>
            <Link
              onClick={() => handleLinkClick("/profile")}
              href="/profile"
              className="rounded-full border border-solid border-black/[.08] ..."
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/Signup"
              className="rounded-full border border-solid border-black/[.08] ..."
            >
              Sign Up
            </Link>
            <Link
              href="/Login"
              className="rounded-full border border-solid border-black/[.08] ..."
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
