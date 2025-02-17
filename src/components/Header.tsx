import * as React from "react";
import Link from "next/link";

export default function Header() {
    return (
        <nav className="bg-purple-800 text-white drop-shadow-xl w-full flex items-center justify-between p-4">
            <Link
                href="/"
                className="font-bold text-xl">
                Jebb's Game Database
            </Link>
            <div className="flex space-x-4">
                <Link
                    href="/signup"
                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                >
                    Sign Up
                </Link>
                <Link
                    href="/login"
                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
                >
                    Log in
                </Link>
            </div>
        </nav>
    );
}