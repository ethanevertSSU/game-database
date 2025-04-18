"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

// static data
const GameList = () => {
  const [manualGameName, setManualGameName] = useState("");
  const [manualPlatform, setManualPlatform] = useState("");
  const [manualShowOtherInput, setManualShowOtherInput] = useState(false);
  const [manualType, setManualType] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [manualError, setManualError] = useState("");
  const [manualOtherPlatformValue, setManualOtherPlatformValue] = useState("");
  const [manualStatus, setManualStatus] = useState("Not Started");
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
        <span>{"Couldn't find your game? "}</span>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-blue-600 hover:underline">
              <span>{"Add one manually"}</span>
            </button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Game Manually</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setManualError("");

                if (!manualGameName || !manualPlatform || !manualType) {
                  setManualError("Please fill out all required fields.");
                  return;
                }

                try {
                  const res = await fetch("/api/form", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      gameName: manualGameName,
                      platform:
                        manualPlatform === "other"
                          ? manualOtherPlatformValue
                          : manualPlatform,
                      physOrDig: manualType,
                      notes: manualNotes,
                      status: manualStatus,
                    }),
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    setManualError(data.error);
                    return;
                  }

                  toast(`Added ${manualGameName} to your library`);

                  // Reset form
                  setManualGameName("");
                  setManualPlatform("");
                  setManualType("");
                  setManualNotes("");
                  setManualShowOtherInput(false);
                  setManualError("");
                  setManualOtherPlatformValue("");
                  setManualStatus("Not Started");
                } catch (error) {
                  console.error("Manual form error:", error);
                  setManualError("Something went wrong");
                }
              }}
              className="flex flex-col gap-2 mt-2"
            >
              <input
                type="text"
                placeholder="Game Name"
                value={manualGameName}
                onChange={(e) => setManualGameName(e.target.value)}
                className="border rounded px-3 py-2 text-black"
              />

              <select
                value={manualPlatform}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setManualPlatform(selectedValue);
                  setManualShowOtherInput(selectedValue === "other");
                }}
                className="border rounded px-3 py-2 text-black"
              >
                <option value="">-- Choose a platform --</option>
                <option value="PC">PC</option>
                <option value="Playstation 5">Playstation 5</option>
                <option value="XBOX Series X">XBOX Series X</option>
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="other">Other</option>
              </select>

              {manualShowOtherInput && (
                <input
                  type="text"
                  placeholder="Enter your platform"
                  value={manualOtherPlatformValue}
                  onChange={(e) => setManualOtherPlatformValue(e.target.value)}
                  className="border rounded px-3 py-2 text-black"
                />
              )}

              <div className="text-sm font-semibold mt-2">
                Physical or Digital?
              </div>
              <label>
                <input
                  type="radio"
                  value="Physical"
                  checked={manualType === "Physical"}
                  onChange={(e) => setManualType(e.target.value)}
                />{" "}
                Physical
              </label>
              <label>
                <input
                  type="radio"
                  value="Digital"
                  checked={manualType === "Digital"}
                  onChange={(e) => setManualType(e.target.value)}
                />{" "}
                Digital
              </label>
              <label className="text-sm font-semibold mt-2">Game Status:</label>
              <select
                className="border rounded px-2 py-1 text-black"
                value={manualStatus}
                onChange={(e) => setManualStatus(e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="Playing">Playing</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>

              <label className="text-sm font-semibold mt-2">
                Additional Notes:
              </label>
              <textarea
                placeholder="Notes"
                value={manualNotes}
                onChange={(e) => setManualNotes(e.target.value)}
                className="border rounded px-3 py-2 text-black"
                rows={3}
              />

              {manualError && <p className="text-red-500">{manualError}</p>}

              <DialogFooter>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </p>
      <Toaster />
    </div>
  );
};

export default GameList;
