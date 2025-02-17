"use client"

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";


export default function Login(){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [retype, setRetype] = useState("");
    const [error, setError] = useState("");

    const handleSubmit  = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== retype) {
            setError("Passwords do not match");
            return;
        }
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({username, password}),
            });
            const data = await response.json();

            if(!response.ok) {
                setError(data.error);
            }
        } catch (error) {
            console.error("Signup failed", error);
            alert("Signup failed");
        }

    }


    return (
        <div className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400">
                <Header />
                <form onSubmit={handleSubmit}
                      className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400">
                    <input
                        className="border-2 rounded px-3 py-2 text-black"
                        type="text"
                        placeholder={"username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border-2 rounded px-3 py-2 text-black"
                        type="password"
                        placeholder={"password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className="border-2 rounded px-3 py-2 text-black"
                        type="password"
                        placeholder={"re-type password"}
                        value={retype}
                        onChange={(e) => setRetype(e.target.value)}
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black">
                        Sign Up
                    </button>
                    <span className="text-sm/2">Already Registered? <Link
                        className="visited:text-purple-600 hover:underline hover:text-blue-600"
                        href="/Login">Login</Link></span>
                </form>
        </div>


)
}