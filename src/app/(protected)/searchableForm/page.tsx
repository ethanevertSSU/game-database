"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { toast } from "sonner";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

type Game = {
  id: string;
  gameName: string;
  platform: string;
  gameType: string;
  Notes: string | null;
  gamePicture: string;
};

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state for future api pulls
  const [error, setError] = useState<string | null>(null); // Track errors
  const [gameType, setGameType] = useState("Digital");

  const fetchGames = async (term: string) => {
    setGames([]);
    try {
      const response = await fetch("/api/igdb-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from IGDB");
      }

      const data = await response.json();
      const formattedGames = data.flatMap((game: any) => {
        const platforms = game.platforms || [{ name: "Unknown" }];
        return platforms.map((platform: any) => ({
          id: `${game.id}-${platform.id}`, // make ID unique per platform
          gameName: game.name,
          platform: platform.name,
          gameType: "Unknown",
          Notes: game.summary || null,
          gamePicture: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
        }));
      });

      setGames(formattedGames);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    fetchGames(searchInput);
  };

  // select a game before immediately inputting it into the library
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
  };

  const filteredGames = games.filter(
    (game) =>
      game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // setError("");
    if (!selectedGame) return;

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          gameName: selectedGame.gameName,
          platform: selectedGame.platform,
          physOrDig: gameType,
          Notes: selectedGame.Notes,
          gamePicture: selectedGame.gamePicture,
        }),
      });

      // const data = await response.json();

      if (!response.ok) {
        // setError(data.error);
        // return;
      } else {
        toast(`Added ${selectedGame.gameName} To Your Library`);
      }

      // setError("");
    } catch (error) {
      console.error("Game form submit failed", error);
      // setError("Could not add game, please try again later");
      return;
    }
  };

  return (
    <div className="flex flex-col gap-3 min-h-screen items-center justify-start bg-purple-400 w-full pb-24">
      <Header />
      <div className="place-items-center font-bold text-3xl text-wrap">
        Add a Game to Your Library!
      </div>
      <div className="flex flex-col gap-3 items-center">
        <div className="flex items-center">
          <input
            className="border border-r-0 rounded-l px-3 py-2.5 text-black w-64 focus:outline-none"
            type="text"
            placeholder="Search games..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="border border-l-0 bg-purple-600 hover:bg-purple-800 text-white rounded-r px-4 py-3.5 flex items-center justify-center"
          >
            <FaSearch />
          </button>
        </div>
        {searchTerm && (
          <>
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {filteredGames.map((game) => (
                  <HoverCard key={game.id}>
                    <HoverCardTrigger asChild>
                      <button
                        onClick={() => handleSelectGame(game)}
                        style={{ width: "300px", height: "250px" }}
                        className="text-left bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                      >
                        <div className="p-4">
                          <div className="relative h-40 w-full">
                            {game.gamePicture ? (
                              <Image
                                src={game.gamePicture}
                                alt={game.gameName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <p className="text-center pt-9 text-gray-500">
                                NO PICTURE AVAILABLE
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col justify-start">
                            <p
                              className="font-bold text-purple-800 text-lg truncate"
                              title={game.gameName}
                            >
                              {game.gameName}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {game.platform} | {game.gameType}
                            </p>
                          </div>
                        </div>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p className="text-gray-600 text-sm mb-2">{game.Notes}</p>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            ) : (
              <p className="text-black mt-4">
                No games found. Try a different search.
              </p>
            )}
          </>
        )}
        {selectedGame && (
          <div className="flex flex-col gap-3 items-center pb-24">
            <div className="place-items-center font-bold text-3xl text-wrap">
              Add this game?
            </div>
            <HoverCard key={selectedGame.id}>
              <HoverCardTrigger asChild>
                <button
                  style={{ width: "300px", height: "250px" }}
                  className="text-left bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <div className="p-4">
                    <div className="relative h-40 w-full">
                      {selectedGame.gamePicture ? (
                        <Image
                          src={selectedGame.gamePicture}
                          alt={selectedGame.gameName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <p className="text-center pt-9 text-gray-500">
                          NO PICTURE AVAILABLE
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col justify-start">
                      <p
                        className="font-bold text-purple-800 text-lg truncate"
                        title={selectedGame.gameName}
                      >
                        {selectedGame.gameName}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {selectedGame.platform} | {selectedGame.gameType}
                      </p>
                    </div>
                  </div>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-gray-600 text-sm mb-2">
                  {selectedGame.Notes}
                </p>
              </HoverCardContent>
            </HoverCard>
            <div className="place-items-center">
              <button
                onClick={handleSubmit}
                className="place-items-center border-2 rounded px-4 py-2 bg-purple-200 hover:bg-purple-600 text-black"
              >
                Submit
              </button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <label htmlFor="gameType" className="text-black font-medium">
                Select Game Type:
              </label>
              <select
                id="gameType"
                value={gameType}
                onChange={(e) => setGameType(e.target.value)}
                className="border rounded px-3 py-2 text-black"
              >
                <option value="Digital">Digital</option>
                <option value="Physical">Physical</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <p>
        Couldn&#39;t find your game? Add one manually using the{" "}
        <Link
          className="visited:text-purple-700 hover:underline hover:text-blue-600 text-blue-600"
          href="/form"
        >
          {" "}
          manual form
        </Link>
      </p>
    </div>
  );
};
export default GameList;
