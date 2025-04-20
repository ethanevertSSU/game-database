"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [platform, setPlatform] = useState("");
  const [physOrDig, setPhysOrDig] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length > 2) {
        fetch("/api/search-games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchTerm }),
        })
          .then((res) => res.json())
          .then(setSearchResults);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!selectedGame || !platform || !physOrDig) {
      setError("Please select a game, platform, and copy type");
      return;
    }

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGame.name,
          platform,
          physOrDig,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      toast(`Added ${selectedGame.name} to your library`);
      setSearchTerm("");
      setSelectedGame(null);
      setPlatform("");
      setPhysOrDig("");
      setNotes("");
    } catch (err) {
      console.error("Submission failed", err);
      setError("Submission failed. Try again later.");
    }
  };

  return (
    <div className="flex flex-col gap-3 h-screen items-center justify-center bg-purple-400 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <h1 className="text-xl font-bold">Enter Your Game!</h1>
        <input
          className="border-2 rounded px-3 py-2 text-black"
          type="text"
          placeholder="Search Game Name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedGame(null);
          }}
        />

        {searchResults.length > 0 && (
          <ul className="bg-white text-black max-h-60 overflow-auto border rounded">
            {searchResults.map((game: any) => (
              <li
                key={game.id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  setSelectedGame(game);
                  setSearchTerm(game.name);
                  setSearchResults([]);
                }}
              >
                {game.name}
              </li>
            ))}
          </ul>
        )}

        <div>
          <label className="font-bold">Platform:</label>
          <input
            className="border-2 rounded px-3 py-2 text-black w-full"
            type="text"
            placeholder="Platform (e.g., PC, PS5)"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>

        <div className="font-bold">Physical or Digital Copy?</div>
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

        <textarea
          className="border-2 rounded px-3 py-2 text-black"
          placeholder="Notes"
          rows={4}
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
    </div>
  );
}
