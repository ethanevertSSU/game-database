"use client";
import Link from "next/link";
import { toast } from "sonner";

export default function Header() {
  const handleLinkClick = (url: string) => {
    if (url === "/form" || url === "/profile" || url === "/library") {
      if (document.cookie.includes("showToast=true")) {
        document.cookie = "showToast=true; Path=/; Max-Age=5; SameSite=Lax";
        toast.warning("Please Log In To Access This Page");
      }
    }
  };

  return (
    <nav className="bg-purple-800 text-white drop-shadow-xl w-full flex items-center justify-between p-4">
      <Link href="/" className="font-bold text-xl">
        JEBBS Game Database
      </Link>
      <div className="flex space-x-4">
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
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Game Form
        </Link>
        <Link
          onClick={() => handleLinkClick("/profile")}
          href="/profile"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Profile
        </Link>
        <Link
          href="/Signup"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Sign Up
        </Link>
        <Link
          href="/Login"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Log in
        </Link>
      </div>
    </nav>
  );
}
