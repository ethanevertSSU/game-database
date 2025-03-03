"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { checkUser } from "@/app/api/Signup/route";
import Link from "next/link";
import Header from "@/components/Header";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    const result = await authClient.signIn.social({
      provider: "google",
    });

    if (result.error) {
      setError(error || "Login failed. Please try again.");
    } else {
      console.log(result.data);
      redirect("/dashboard");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const userTaken = await checkUser(username);
    if (!username || !email || !password || !retype) {
      setError("Please Enter All Credentials");
    } else if (userTaken) {
      setError("Username is already taken");
    } else if (password !== retype) {
      setError("Passwords don't match");
    } else {
      const result = await authClient.signUp.email({
        email: email,
        password: password,
        name: username,
      });

      if (result.error) {
        setError(result.error.message || "Login failed. Please try again.");
      } else {
        console.log(result);
        redirect("/login");
      }
    }
  };

  return (
    <span className="h-screen flex flex-col">
      <Header />
      <div className="flex h-screen flex-col gap-4 items-center justify-center  bg-purple-400">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 items-center bg-purple-400"
        >
          <h1>**Passwords Must Be 8 Characters Long Minimum**</h1>
          <input
            className="border-2 rounded px-3 py-2 text-black"
            type="text"
            placeholder={"Username"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border-2 rounded px-3 py-2 text-black"
            type="text"
            placeholder={"Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border-2 rounded px-3 py-2 text-black"
            type="password"
            placeholder={"Password 8 Char Minimum"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="border-2 rounded px-3 py-2 text-black"
            type="password"
            placeholder={"Re-type Password"}
            value={retype}
            onChange={(e) => setRetype(e.target.value)}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black">
            Sign Up
          </button>
        </form>
        <form onSubmit={handleGoogleSubmit}>
          <button className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-green-300 text-black">
            Sign In With Google
          </button>
        </form>
        <span className="text-sm/2">
          Already Registered?{" "}
          <Link
            className="visited:text-purple-600 hover:underline hover:text-blue-600"
            href="/Login"
          >
            Login
          </Link>
        </span>
      </div>
    </span>
  );
}
