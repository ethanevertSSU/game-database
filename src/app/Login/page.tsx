"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/Login", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({ identifier , password}),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }
            setError("");
            router.push("/dashboard");

        } catch (error) {
            console.error("Login Failed", error);
            alert("Login Failed failed");
        }

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
                    placeholder="Username Or Email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
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
                <span className="text-sm/2">Need to sign up? <Link
        className="visited:text-purple-600 hover:underline hover:text-blue-600"
        href="/Signup">Sign Up</Link></span>

            </form>
        </div>
            );
            }