"use client";

import React, { useState } from "react";
// Next.js 13+ (App Router) import:
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

// If you're on Next.js 12 (Pages Router), you'd do:
// import { useRouter } from "next/router";

export default function Login() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Basic client-side validation
        if (!username || !password) {
            setError("Please enter a username and password.");
            return;
        }
        setError(""); // clear any previous error

            // Send credentials to your Next.js API route.
            // This route should handle checking the DB via Prisma.
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // If the API returns an error, parse and display it
                const { message } = await response.json();
                setError(message || "Login failed. Please try again.");
                return;
            }

            // If successful, you can navigate to a home or dashboard page
            router.push("/");
    };

    return (
        <div className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400">
            <Header/>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400"
            >
                <input
                    className="border-2 rounded px-3 py-2 text-black"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="border-2 rounded px-3 py-2 text-black"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-red-600">{error}</p>}

                <button type="submit"
                        className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black">
                    Login
                </button>

                <button>
    <span className="text-sm/2">Need to sign up? <Link
        className="visited:text-purple-600 hover:underline hover:text-blue-600"
        href="/Signup">Sign Up</Link></span>
                </button>
            </form>
        </div>
            );
            }