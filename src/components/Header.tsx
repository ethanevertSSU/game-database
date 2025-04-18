"use client";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";
import useSWR, { mutate } from "swr";
import { useState } from "react";
import { search } from "../../public/search";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const preload = async (url: string) => {
  await mutate(url, fetcher(url), false);
};

export default function Header() {
  const { data: isLoggedIn } = useSWR("/api/session", fetcher, {});

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Search query submitted:", searchQuery);
    if (searchQuery) router.push(`/profile/${searchQuery}`);
  };

  const handleLinkClick = (url: string) => {
    if (["/form", "/profile", "/library"].includes(url) && !isLoggedIn) {
      if (document.cookie.includes("showToast=true")) {
        document.cookie = "showToast=true; Path=/; Max-Age=5; SameSite=Lax";
        toast.warning("Please Log In To Access This Page");
      }
    }
  };

  if (isLoggedIn === undefined) {
    return (
      <nav className="bg-purple-800 text-white drop-shadow-xl w-full flex items-center justify-between p-4">
        <Link href="/" className="font-bold text-xl">
          JEBBS Game Database
        </Link>
        <div className="flex space-x-4">
          <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"></button>
          <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"></button>
          <button className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"></button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-purple-800 text-white drop-shadow-xl w-full flex items-center justify-between p-4">
      <Link href="/" className="font-bold text-xl">
        JEBBS Game Database
      </Link>
      <div className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search Profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-full text-black text-sm sm:text-base h-10  sm:h-12 px-7 sm:px-5 pr-16 overflow-hidden"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 bg-white text-black flex items-center justify-center rounded-full"
                >
                  {search}
                </button>
              </div>
            </form>
            <Link
              onClick={() => handleLinkClick("/library")}
              href="/library"
              className="rounded-full bg-purple-700 hover:bg-purple-600 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 flex items-center justify-center text-center whitespace-normal"
            >
              Game Library
            </Link>
            <Link
              onClick={() => handleLinkClick("/searchableForm")}
              href="/searchableForm"
              className="rounded-full bg-purple-700 hover:bg-purple-600 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 flex items-center justify-center text-center whitespace-normal"

              //className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Game Form
            </Link>
            <Link
              onClick={() => handleLinkClick("/profile")}
              onMouseEnter={() => preload("/api/profile")}
              href="/profile"
              className="rounded-full bg-purple-700 hover:bg-purple-600 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 flex items-center justify-center text-center whitespace-normal"

              //className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full bg-purple-700 hover:bg-purple-600 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-red-500 flex items-center justify-center text-center whitespace-normal"

              //className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/Signup"
              className="rounded-full bg-purple-700 hover:bg-purple-600 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 flex items-center justify-center text-center whitespace-normal"

              //className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Sign Up
            </Link>
            <Link
              href="/Login"
              className="rounded-full bg-purple-700 hover:bg-purple-600 text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 flex items-center justify-center text-center whitespace-normal"

              //className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
