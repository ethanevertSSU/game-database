"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";
import steamIcon from "../../../../public/steam_logo.png";
import { Toaster } from "@/components/ui/sonner";
import { FaStar } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { motion, AnimatePresence } from "framer-motion";

type Game = {
  id: string;
  gameName: string;
  platform: string;
  gameType: string;
  Notes: string | null;
  gamePicture: string | null;
  externalAppId?: string | null;
  status: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GameList = () => {
  const [localGameImages, setLocalGameImages] = useState<
    Record<string, string>
  >({});
  useEffect(() => {
    const saved: Record<string, string> = {};
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("game_image_")) {
        const id = key.replace("game_image_", "");
        saved[id] = localStorage.getItem(key)!;
      }
    });
    setLocalGameImages(saved);
  }, []);
  const handleGameImageChange = (
    gameId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setLocalGameImages((prev) => ({ ...prev, [gameId]: dataUrl }));
      localStorage.setItem(`game_image_${gameId}`, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const [searchTerm, setSearchTerm] = useState("");
  // For sorting games
  type sortedOrder = "asc" | "desc" | "status-asc" | "status-desc";
  const [sortOrder, setSortOrder] = useState<sortedOrder>("asc");

  // used for editing the notes of a game
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editedStatus, setEditedStatus] = useState("Not Started");
  const [editedNotes, setEditedNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (selectedGame) {
      setEditedNotes(selectedGame.Notes || "");
      setEditedStatus(selectedGame.status || "Not Started");
    }
  }, [selectedGame]);

  const { data, isLoading, mutate } = useSWR<{ game: Game[] }>(
    "/api/library",
    fetcher,
  );

  const games = data?.game || [];

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const allGenres = Array.from(
    new Set(
      games.flatMap(
        (game) => game.Notes?.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [],
      ),
    ),
  ).sort();

  const statusOrder: Record<string, number> = {
    "Not Started": 0,
    "On Hold": 1,
    Playing: 2,
    Completed: 3,
  };

  const handleSearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = [...games]
    .filter((game) => {
      const matchesSearch =
        game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.gameType.toLowerCase().includes(searchTerm.toLowerCase());

      const gameTags =
        game.Notes?.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];

      const matchesGenres =
        selectedGenres.length === 0 ||
        selectedGenres.every((g) => gameTags.includes(g));

      return matchesSearch && matchesGenres;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.gameName.localeCompare(b.gameName);
      } else if (sortOrder === "desc") {
        return b.gameName.localeCompare(a.gameName);
      } else if (sortOrder === "status-asc") {
        return statusOrder[a.status] - statusOrder[b.status];
      } else if (sortOrder === "status-desc") {
        return statusOrder[b.status] - statusOrder[a.status];
      }
      return 0;
    });

  // Pie chart status tracking
  const statusCounts: Record<string, number> = {
    "Not Started": 0,
    "On Hold": 0,
    Playing: 0,
    Completed: 0,
  };

  games.forEach((game) => {
    if (statusCounts[game.status] !== undefined) {
      statusCounts[game.status]++;
    }
  });

  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status,
    value,
  }));

  const STATUS_COLORS = {
    "Not Started": "#a3a3a3", // gray
    "On Hold": "#eab308", // yellow
    Playing: "#3b82f6", // blue
    Completed: "#22c55e", // green
  };

  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false);

  const statusPillStyles: Record<string, string> = {
    "Not Started": "bg-gray-200 text-gray-700",
    "On Hold": "bg-yellow-200 text-yellow-800",
    Playing: "bg-blue-200 text-blue-800",
    Completed: "bg-green-200 text-green-800",
  };

  const [randomGame, setRandomGame] = useState<Game | null>(null);
  const [isRandomOpen, setIsRandomOpen] = useState(false);

  const handleRandomPick = () => {
    const eligibleGames = filteredGames.filter(
      (g) => g.status === "Not Started" || g.status === "On Hold",
    );

    if (eligibleGames.length === 0) {
      toast("No eligible games found.");
      return;
    }

    const selected =
      eligibleGames[Math.floor(Math.random() * eligibleGames.length)];
    setRandomGame(selected);
    setIsRandomOpen(true);
    toast(`You should play: ${selected.gameName}`);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedGameIds, setSelectedGameIds] = useState<Set<string>>(
    new Set(),
  );

  const toggleGameSelection = (id: string) => {
    let shouldOpenSidebar = false;

    setSelectedGameIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        shouldOpenSidebar = true;
      }
      return newSet;
    });

    if (!sidebarOpen && shouldOpenSidebar) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-3 h-screen items-center justify-top bg-purple-400">
      <Header />
      {isLoading && (
        <div className=" flex h-screen items-center justify-center font-bold text-3xl">
          Loading games...
        </div>
      )}
      {!isLoading && games.length > 0 && (
        <div className="flex flex-row w-full bg-purple-400">
          <AnimatePresence>
            <motion.div
              initial={false}
              animate={{
                width: sidebarOpen ? 250 : 0,
                opacity: sidebarOpen ? 1 : 0,
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="overflow-hidden shrink-0 rounded-lg mt-4 ml-4 bg-transparent"
            >
              <div
                className={`bg-white shadow-md rounded-lg p-4 flex flex-col gap-3 ${
                  sidebarOpen ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
              >
                <h2 className="text-lg font-bold">Tools</h2>
                <select
                  className="w-full border rounded px-3 py-2 text-black"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as sortedOrder)}
                >
                  <option value="asc">Sort A–Z</option>
                  <option value="desc">Sort Z–A</option>
                  <option value="status-asc">
                    Sort by Status (Progression)
                  </option>
                  <option value="status-desc">
                    Sort by Status (Completion)
                  </option>
                </select>
                <button
                  onClick={() => setIsChartOpen(true)}
                  className="w-full bg-white border rounded px-3 py-2 hover:bg-purple-100 font-semibold"
                >
                  📊 View Chart
                </button>
                  <button
                      onClick={() => setIsGenreDialogOpen(true)}
                      className="bg-white border rounded px-3 py-2 hover:bg-purple-100 font-semibold"
                  >
                      🎯 Genres
                  </button>

                  <button
                  onClick={handleRandomPick}
                  className="w-full bg-white border rounded px-3 py-2 hover:bg-purple-100 font-semibold"
                >
                  🎲 Random Game
                </button>

                {selectedGameIds.size > 0 && (
                  <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Bulk Actions ({selectedGameIds.size} selected)
                    </p>

                    <button
                      onClick={async () => {
                        const confirmed = confirm(
                          `Delete ${selectedGameIds.size} game(s)? This cannot be undone.`,
                        );
                        if (!confirmed) return;

                        try {
                          await Promise.all(
                            Array.from(selectedGameIds).map((id) =>
                              fetch(`/api/library/${id}`, { method: "DELETE" }),
                            ),
                          );
                          toast("Games deleted.");
                          setSelectedGameIds(new Set());
                          await mutate();
                        } catch (error) {
                          console.error(error);
                          toast("Failed to delete some games.");
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      🗑 Delete Selected
                    </button>

                    <select
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          await Promise.all(
                            Array.from(selectedGameIds).map((id) =>
                              fetch(`/api/library/${id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: newStatus }),
                              }),
                            ),
                          );
                          toast(
                            `Updated status to ${newStatus} for selected games.`,
                          );
                          setSelectedGameIds(new Set());
                          await mutate();
                        } catch (err) {
                          console.error(err);
                          toast("Failed to update some games.");
                        }
                      }}
                      defaultValue=""
                      className="border rounded px-3 py-2 text-black"
                    >
                      <option value="" disabled>
                        Change Status...
                      </option>
                      <option value="Not Started">Not Started</option>
                      <option value="Playing">Playing</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex-1 flex flex-col px-4 pb-4">
            <div className="w-full max-w-7xl mx-auto">
              {/* Sidebar toggle button */}
              <div className="relative w-full mb-4 h-12 flex items-center">
                <div className="absolute left-0 pl-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-white border rounded px-3 py-2 text-black shadow hover:bg-purple-100 font-bold"
                  >
                    ☰
                  </button>
                </div>

                <div className="mx-auto w-full max-w-md">
                  <input
                    className="w-full border rounded px-4 py-2 text-black"
                    type="text"
                    placeholder="Search games..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4">
                <AnimatePresence>
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        marginLeft: sidebarOpen ? 10 : 0,
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 1.5,
                        ease: "easeOut",
                      }}
                    >
                      <HoverCard key={game.id}>
                        <div
                          style={{ width: "300px", height: "320px" }}
                          className={`group p-[3px] rounded-lg bg-gradient-to-b transition-all duration-300 ease-in-out transform hover:scale-105 ${
                            game.status === "Completed"
                              ? "from-green-400 to-green-600 hover:shadow-[0_0_15px_rgba(34,197,94,0.7)]"
                              : game.status === "Playing"
                                ? "from-blue-400 to-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
                                : game.status === "On Hold"
                                  ? "from-yellow-400 to-yellow-600 hover:shadow-[0_0_15px_rgba(234,179,8,0.7)]"
                                  : "from-gray-300 to-gray-400 hover:shadow-[0_0_10px_rgba(107,114,128,0.6)]"
                          }`}
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedGameIds.has(game.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleGameSelection(game.id);
                              }}
                              className="absolute top-2 left-2 w-4 h-4 z-10"
                            />
                          </div>
                          <HoverCardTrigger
                            asChild
                            onClick={() => {
                              setSelectedGame(game);
                              setEditedNotes(game.Notes || "");
                            }}
                          >
                            <button className="bg-white text-left w-full h-full rounded-lg shadow-md overflow-hidden transition-transform">
                              <div className="p-4">
                                <div className="relative h-40 w-full group">
                                  {localGameImages[game.id] ||
                                  game.gamePicture ? (
                                    <>
                                      <Image
                                        src={
                                          localGameImages[game.id] ||
                                          game.gamePicture ||
                                          "../../../../public/cat.jpg"
                                        }
                                        alt={game.gameName}
                                        fill
                                        className={`${
                                          game.platform.includes("Steam")
                                            ? "rounded w-[300px] h-[200px] shadow-2xl"
                                            : "object-scale-down w-[300px] h-[200px]"
                                        }`}
                                      />
                                      <div
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() =>
                                          document
                                            .getElementById(
                                              `file-input-${game.id}`,
                                            )
                                            ?.click()
                                        }
                                      >
                                        <span className="text-white font-semibold">
                                          Change Image
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div
                                      className="h-full w-full flex items-center justify-center bg-gray-200 cursor-pointer"
                                      onClick={() =>
                                        document
                                          .getElementById(
                                            `file-input-${game.id}`,
                                          )
                                          ?.click()
                                      }
                                    >
                                      <p className="text-center text-gray-500">
                                        NO PICTURE AVAILABLE
                                        <br />
                                        Click to add
                                      </p>
                                    </div>
                                  )}
                                  <input
                                    id={`file-input-${game.id}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleGameImageChange(game.id, e)
                                    }
                                  />
                                </div>
                                <div className="flex flex-col justify-start">
                                  <p
                                    className="font-bold text-purple-800 text-lg truncate"
                                    title={game.gameName}
                                  >
                                    {game.gameName}
                                  </p>
                                  <p className="text-gray-700 text-sm flex gap-1 items-center">
                                    <span className="truncate max-w-[200px]">
                                      {game.platform}
                                    </span>
                                    <span>|</span>
                                    <span>{game.gameType}</span>
                                  </p>
                                  {game.externalAppId && (
                                    <Link
                                      href={`https://store.steampowered.com/app/${game.externalAppId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-600 hover:underline mt-1"
                                    >
                                      <Image
                                        src={steamIcon}
                                        alt="Steam"
                                        width={14}
                                        height={14}
                                      />
                                      <span className="text-xs">
                                        View on Steam
                                      </span>
                                    </Link>
                                  )}
                                  <div className="flex items-center gap-2 mt-1 justify-end">
                                    <span
                                      className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${statusPillStyles[game.status]}`}
                                    >
                                      {game.status}
                                      {game.status === "Completed" && (
                                        <FaStar className="text-yellow-400" />
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          </HoverCardTrigger>
                        </div>
                        <HoverCardContent className="w-80">
                          <p className="text-gray-600 text-sm mb-2">
                            {game.Notes}
                          </p>
                        </HoverCardContent>
                      </HoverCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="font-bold">
                Add more games to your library using the{" "}
                <Link
                  className="visited:text-purple-600 hover:underline hover:text-blue-600 text-gray-500"
                  href="/searchableForm"
                >
                  form
                </Link>{" "}
              </div>
            </div>
          </div>
        </div>
      )}
      <Dialog open={isGenreDialogOpen} onOpenChange={setIsGenreDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter by Genre</DialogTitle>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 mt-2">
            {allGenres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-sm cursor-pointer hover:bg-purple-100 transition"
              >
                <input
                  type="checkbox"
                  className="accent-purple-600"
                  checked={selectedGenres.includes(genre)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedGenres((prev) => [...prev, genre]);
                    } else {
                      setSelectedGenres((prev) =>
                        prev.filter((g) => g !== genre),
                      );
                    }
                  }}
                />
                <span>#{genre}</span>
              </label>
            ))}
          </div>

          <DialogFooter className="mt-4 flex justify-end">
            <button
              onClick={() => setIsGenreDialogOpen(false)}
              className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedGame}
        onOpenChange={(open) => !open && setSelectedGame(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Notes for {selectedGame?.gameName} or Delete it
            </DialogTitle>
          </DialogHeader>

          <textarea
            className="w-full border rounded p-2 text-black mt-2"
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            rows={4}
          />

          <label className="text-sm font-semibold mt-2">Game Status:</label>
          <select
            className="w-full border rounded p-2 text-black mt-1"
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
          >
            <option value="Not Started">Not Started</option>
            <option value="Playing">Playing</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* Inline Save / Cancel */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setSelectedGame(null);
                setEditedStatus("Not Started");
                setEditedNotes("");
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              onClick={async () => {
                setIsSaving(true);
                try {
                  const response = await fetch(
                    `/api/library/${selectedGame?.id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        Notes: editedNotes,
                        status: editedStatus,
                      }),
                    },
                  );

                  if (!response.ok) toast("Failed to update");

                  toast("Notes updated successfully!");
                  await mutate(
                    (currentData) => {
                      if (!currentData) return { game: [] };
                      return {
                        //getting games and keeping them in the game area, just editing notes
                        game: currentData.game.map((g) =>
                          g.id === selectedGame?.id
                            ? { ...g, Notes: editedNotes, status: editedStatus }
                            : g,
                        ),
                      };
                    },
                    false, //this means no full refresh
                  );
                  setSelectedGame(null);
                  setEditedNotes("");
                  setEditedStatus("Not Started");
                } catch (error) {
                  console.log(error);
                  toast("Something went wrong while updating.");
                } finally {
                  setIsSaving(false);
                }
              }}
              className="text-sm bg-purple-600 hover:bg-purple-800 text-white px-3 py-1 rounded"
            >
              Save
            </button>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <div className="w-full flex justify-end">
              <button
                onClick={async () => {
                  const confirmed = window.confirm(
                    `Are you sure you want to delete "${selectedGame?.gameName}" from your library? This cannot be undone.`,
                  );
                  if (!confirmed || !selectedGame) return;

                  try {
                    const res = await fetch(`/api/library/${selectedGame.id}`, {
                      method: "DELETE",
                    });

                    if (!res.ok) {
                      toast("Failed to delete game");
                      return;
                    }

                    toast("Game deleted.");

                    await mutate((currentData) => {
                      if (!currentData) return { game: [] };
                      return {
                        game: currentData.game.filter(
                          (g) => g.id !== selectedGame.id,
                        ),
                      };
                    }, false);

                    setSelectedGame(null);
                    setEditedNotes("");
                    setEditedStatus("Not Started");
                  } catch (err) {
                    console.error(err);
                    toast("Failed to delete the game.");
                  }
                }}
                className="text-sm bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded"
              >
                Delete Game from Library
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isChartOpen} onOpenChange={setIsChartOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Game Status Breakdown</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <DialogFooter className="mt-4 flex justify-end">
            <button
              onClick={() => setIsChartOpen(false)}
              className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isRandomOpen} onOpenChange={setIsRandomOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>You should play:</DialogTitle>
          </DialogHeader>

          {randomGame && (
            <div className="flex flex-col items-center text-center">
              <p className="text-xl font-bold text-purple-700">
                {randomGame.gameName}
              </p>
              <p className="text-gray-600 text-sm mt-1 mb-3">
                {randomGame.platform} | {randomGame.gameType}
              </p>

              {randomGame.gamePicture && (
                <div className="relative w-full h-[160px] rounded overflow-hidden mb-4">
                  <Image
                    src={randomGame.gamePicture}
                    alt={randomGame.gameName}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <p className="text-sm text-gray-700 mb-3">{randomGame.Notes}</p>
            </div>
          )}

          <DialogFooter className="mt-4 flex justify-between">
            <button
              onClick={async () => {
                if (!randomGame) return;

                // Update status to "Playing"
                try {
                  const res = await fetch(`/api/library/${randomGame.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Playing" }),
                  });

                  if (!res.ok) throw new Error("Failed to update");

                  toast(`Now playing: ${randomGame.gameName}`);
                  setIsRandomOpen(false);
                  await mutate(); // refresh game list
                } catch (err) {
                  console.error(err);
                  toast("Failed to update game status.");
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              ✅ Start Playing
            </button>

            <button
              onClick={handleRandomPick}
              className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              🔁 Try Again
            </button>

            <button
              onClick={() => setIsRandomOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!isLoading && games.length == 0 && (
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
      <Toaster />
    </div>
  );
};

export default GameList;
