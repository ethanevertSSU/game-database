"use client"

import { useState } from "react";
import Link from "next/link";


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

    console.log("Username:", username);
    console.log("Password:", password);



    return (

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 h-screen place-items-center justify-center">
            <input
                className="border-2 rounded"
                type="text"
                placeholder={"username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="border-2 rounded "
                type="password"
                placeholder={"password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="border-2 rounded "
                type="password"
                placeholder={"re-type password"}
                value={retype}
                onChange={(e) => setRetype(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <button className="border-2 rounded" type="submit">
                Sign Up
            </button>
            <span className="text-sm/6">Already Registered? <Link className="hover:underline hover:text-blue-400"
                                                                  href="/Login">Login</Link></span>
        </form>


    )
}