"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { authClient } from "@/app/lib/auth-client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleGoogleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/profile",
    });

    if (result.error) {
      setError("Login failed. Please try again.");
    } else {
      console.log(result.data);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please enter credentials");
      toast("Please enter both email and password.");
    } else {
      const result = await authClient.signIn.email({
        email: identifier,
        password: password,
        callbackURL: "/profile",
      });

      if (result.error) {
        setError(result.error.message || "Login failed. Please try again.");
      } else {
        console.log(result);
      }
    }
  };

  return (
    <span className="h-screen flex flex-col">
      <Header />
      <div className="flex h-screen flex-col gap-4 items-center justify-center bg-purple-400">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 items-center bg-purple-400"
        >
          <input
            className="border-2 rounded px-3 py-2 text-black"
            type="text"
            placeholder="Email"
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

          <button className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black">
            Login
          </button>
        </form>
        <form onSubmit={handleGoogleSubmit}>
          <button className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-green-300 text-black">
            Sign In With Google
          </button>
        </form>
        <span className="text-sm">
          Need to sign up?{" "}
          <Link
            className="visited:text-purple-600 hover:underline hover:text-blue-600 text-gray-500"
            href="/Signup"
          >
            Sign Up
          </Link>
        </span>
      </div>
      <Toaster />
    </span>
  );
}
