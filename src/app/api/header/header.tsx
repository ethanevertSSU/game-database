import Link from "next/link";
import { auth } from "../../lib/auth";
import { headers } from "next/headers";

export default async function HeaderIfAuthenticated() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex space-x-4">
        <Link
          href="/form"
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#6e33ff] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          Form
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
    );
  }

  return (
    <div className="flex space-x-4">
      <Link href="/dashboard" className="text-white hover:underline">
        Dashboard
      </Link>
      <Link href="/library" className="text-white hover:underline">
        Library
      </Link>
      <Link href="/logout" className="text-white hover:underline">
        Logout
      </Link>
    </div>
  );
}
