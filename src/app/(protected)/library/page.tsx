"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

type Game = {
  id: string;
  gameName: string;
  platform: string;
  gameType: string;
  Notes: string | null;
  gamePicture: string | null;
};

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]); //hooks , forces structure to data
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null); // Track errors

  const handleSearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = games.filter(
    (game) =>
      game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/library", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          setError("Failed to fetch games");
        }

        const data = await response.json();
        setGames(data.game);
      } catch (error) {
        console.log(error);
        setError("Error fetching games");
      } finally {
        setLoading(false);
      }
    };
    (async () => {
      await fetchGames();
    })();
  }, []); // Runs once when the component mounts

  return (
    <div className="flex flex-col gap-3 h-screen items-center justify-top bg-purple-400">
      <Header />
      {loading && (
        <div className=" flex h-screen items-center justify-center font-bold text-3xl">
          Loading games...
        </div>
      )}
      {error && !loading && <p className="text-red-500">{error}</p>}
      {!loading && !error && games.length > 0 && (
        <div className="flex flex-col gap-3 h-screen items-center justify-top bg-purple-400">
          <input
            className="border-3 rounded px-3 py-2 text-black"
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {filteredGames.map((game) => (
              <HoverCard key={game.id}>
                <HoverCardTrigger asChild>
                  <button
                    style={{ width: "300px", height: "250px" }}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                  >
                    <div className="p-4">
                      <h3
                        className="font-bold text-purple-800 text-lg truncate"
                        title={game.gameName}
                      >
                        {game.gameName}
                      </h3>
                      <p className="text-gray-600 text-sm">{game.platform}</p>
                      <p className="text-gray-600 text-sm">{game.gameType}</p>
                    </div>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-gray-600 text-sm mb-2">{game.Notes}</p>
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
          <div className="font-bold">
            Add more games to your library using the{" "}
            <Link
              className="visited:text-purple-600 hover:underline hover:text-blue-600 text-gray-500"
              href="/form"
            >
              form
            </Link>{" "}
          </div>
        </div>
      )}
      {!loading && !error && games.length == 0 && (
        <div className=" flex h-screen items-center justify-center font-bold text-3xl">
          <span>
            No games in your library, please add a game using the{" "}
            <Link
              className="visited:text-purple-600 hover:underline hover:text-blue-600 text-gray-500"
              href="/form"
            >
              form
            </Link>{" "}
          </span>
        </div>
      )}
    </div>
  );
};

export default GameList;
