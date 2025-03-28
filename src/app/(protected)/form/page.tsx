"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function Login() {
  const [gameName, setGameName] = useState("");
  const [platform, setPlatform] = useState("");
  // const [otherPlatformValue, setOtherPlatformValue] = useState(""); //for future use in more platforms
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [physOrDig, setPhysOrDig] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!gameName || !platform || !physOrDig) {
      setError(
        "Please Input Game Name, Platform, and Copy Status (Notes Are Optional)",
      );
      return;
    }

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gameName, platform, physOrDig, notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      } else {
        toast(`Added ${gameName} To Your Library`);

        setGameName("");
        setPlatform("");
        setPhysOrDig("");
        setNotes("");
        setShowOtherInput(false);
      }

      setError("");
    } catch (error) {
      console.error("Game form submit failed", error);
      setError("Could not create game, please try again later");
      return;
    }
  };

  return (
    <div className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400">
      <Header />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 h-screen items-center justify-center bg-purple-400"
      >
        <h1>**Games You Input In The Form Show Up In Your Library**</h1>
        <div className="place-items-center font-bold text-3xl text-wrap">
          Enter Your Game!
        </div>
        <input
          className="border-2 rounded px-3 py-2 text-black"
          type="text"
          placeholder={"Game Name"}
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <div className="font-bold text-2xl text-wrap mb-2">
          Select a platform:
        </div>
        <select
          className="border rounded px-3 py-2 text-black"
          value={platform}
          onChange={(e) => {
            const selectedValue = e.target.value;
            setPlatform(selectedValue);
            setShowOtherInput(selectedValue === "other");
          }}
        >
          <option value="">-- Choose a platform --</option>
          <option value="PC">PC</option>
          <option value="Playstation 5">Playstation 5</option>
          <option value="XBOX Series X">XBOX Series X</option>
          <option value="Nintendo Switch">Nintendo Switch</option>
          <option value="other">Other</option>
        </select>

        {showOtherInput && (
          <input
            type="text"
            placeholder="Enter your platform"
            className="mt-2 border rounded px-3 py-2 text-black"
          />
        )}
        <div className="font-bold text-2xl text-wrap">
          Physical or Digital Copy?:
        </div>
        <label>
          <input
            type="radio"
            value="physical"
            checked={physOrDig === "physical"}
            onChange={(e) => setPhysOrDig(e.target.value)}
          />{" "}
          Physical
        </label>
        <label>
          <input
            type="radio"
            value="digital"
            checked={physOrDig === "digital"}
            onChange={(e) => setPhysOrDig(e.target.value)}
          />{" "}
          Digital
        </label>
        <div className="font-bold text-2xl text-wrap">Additional Notes:</div>
        <textarea
          className="border-2 rounded px-3 py-2 text-black"
          rows={4}
          cols={50}
          placeholder={"Notes"}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black"
        >
          Submit
        </button>
      </form>
      <Toaster />
    </div>
  );
}
