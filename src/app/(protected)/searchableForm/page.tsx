"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";

interface Platform {
  name: string;
}

interface Cover {
  image_id: string;
}

interface IGDBGame {
  id: number;
  name: string;
  platforms?: Platform[];
  summary?: string;
  cover?: Cover;
}

type Game = {
  id: string;
  gameName: string;
  platforms: string[];
  Notes: string | null;
  gamePicture: string;
};

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [platformSelection, setPlatformSelection] = useState<
    Record<string, string>
  >({});
  const [typeSelection, setTypeSelection] = useState<Record<string, string>>(
    {},
  );

  const fetchGames = async (term: string) => {
    setGames([]);
    try {
      const response = await fetch("/api/igdb-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: term }),
      });

      if (!response.ok) {
        toast("Failed to fetch from IGDB");
      }

      const data: IGDBGame[] = await response.json();
      const formattedGames: Game[] = data.map((game: IGDBGame) => {
        const platforms = game.platforms?.map((p: Platform) => p.name) || [
          "Unknown",
        ];
        return {
          id: game.id.toString(),
          gameName: game.name,
          platforms,
          Notes: game.summary || null,
          gamePicture: game.cover
            ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
            : "",
        };
      });

      setGames(formattedGames);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast(err.message || "Something went wrong");
      } else {
        toast("An unknown error occurred");
      }
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    return fetchGames(searchInput);
  };

  const handleSubmit = async (game: Game) => {
    const platform = platformSelection[game.id] || game.platforms[0];
    const gameType = typeSelection[game.id] || "Digital";

    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          gameName: game.gameName,
          platform,
          physOrDig: gameType,
          Notes: game.Notes,
          gamePicture: game.gamePicture,
        }),
      });

      if (!response.ok) {
        toast("Failed to submit");
      }

      toast(
        `Added ${game.gameName} (${platform}, ${gameType}) to your library`,
      );
    } catch (error) {
      console.error("Game form submit failed", error);
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
            {games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-72"
                  >
                    <div className="flex items-center justify-center bg-black h-[320px] w-full">
                      {game.gamePicture ? (
                        <Image
                          src={game.gamePicture}
                          alt={game.gameName}
                          className="object-contain w-full h-full"
                          width={0}
                          height={0}
                          sizes="100vw"
                        />
                      ) : (
                        <p className="text-center pt-9 text-gray-500">
                          NO PICTURE AVAILABLE
                        </p>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <p
                        className="font-bold text-purple-800 text-lg truncate"
                        title={game.gameName}
                      >
                        {game.gameName}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">{game.Notes}</p>
                      <label className="text-sm font-semibold">Platform:</label>
                      <select
                        className="border rounded px-2 py-1"
                        value={platformSelection[game.id] || game.platforms[0]}
                        onChange={(e) =>
                          setPlatformSelection((prev) => ({
                            ...prev,
                            [game.id]: e.target.value,
                          }))
                        }
                      >
                        {game.platforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                      <label className="text-sm font-semibold mt-2">
                        Type:
                      </label>
                      <select
                        className="border rounded px-2 py-1"
                        value={typeSelection[game.id] || "Digital"}
                        onChange={(e) =>
                          setTypeSelection((prev) => ({
                            ...prev,
                            [game.id]: e.target.value,
                          }))
                        }
                      >
                        <option value="Digital">Digital</option>
                        <option value="Physical">Physical</option>
                      </select>
                      <button
                        onClick={() => handleSubmit(game)}
                        className="mt-3 bg-purple-300 hover:bg-purple-600 text-black font-semibold px-4 py-2 rounded"
                      >
                        Add Game
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-black mt-4">
                No games found. Try a different search.
              </p>
            )}
          </>
        )}
      </div>
      <p>
        Couldn&#39;t find your game? Add one manually using the{" "}
        <Link
          className="visited:text-purple-700 hover:underline hover:text-blue-600 text-blue-600"
          href="/form"
        >
          manual form
        </Link>
      </p>
      <Toaster />
    </div>
  );
};

export default GameList;
