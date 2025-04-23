"use client";

import React, { useState } from "react";
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
  status: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GameList = () => {
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
    .filter(
      (game) =>
        game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.gameType.toLowerCase().includes(searchTerm.toLowerCase()),
    )
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

  const statusPillStyles: Record<string, string> = {
    "Not Started": "bg-gray-200 text-gray-700",
    "On Hold": "bg-yellow-200 text-yellow-800",
    Playing: "bg-blue-200 text-blue-800",
    Completed: "bg-green-200 text-green-800",
  };

  const statusBorderStyles: Record<string, string> = {
    "Not Started": "border-gray-300",
    "On Hold": "border-yellow-400",
    Playing: "border-blue-500",
    Completed: "border-green-500",
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
        <div className="flex flex-col gap-3 w-full items-center justify-top bg-purple-400">
          <div className="w-full max-w-6xl px-4 mb-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <input
                className="border rounded px-3 py-2 text-black"
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <select
                className="border rounded px-3 py-2 text-black"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as sortedOrder)}
              >
                <option value="asc">Sort A–Z</option>
                <option value="desc">Sort Z–A</option>
                <option value="status-asc">Sort by Status (Progression)</option>
                <option value="status-desc">Sort by Status (Completion)</option>
              </select>
              <button
                onClick={() => setIsChartOpen(true)}
                className="bg-white border rounded px-3 py-2 hover:bg-purple-100 font-semibold"
              >
                📊 View Chart
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <AnimatePresence mode="wait">
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut",
                  }}
                >
                  <HoverCard key={game.id}>
                    <div
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
                      <HoverCardTrigger asChild>
                        <button
                          style={{ width: "290px", height: "260px" }}
                          className="bg-white text-left w-full h-full rounded-lg shadow-md overflow-hidden transition-transform"
                        >
                          <div className="p-4">
                            <div className="relative h-40 w-full">
                              {game.gamePicture ? (
                                <Image
                                  src={game.gamePicture}
                                  alt={game.gameName}
                                  fill
                                  className={`${game?.platform?.includes("Steam") ? "rounded w-[300px] h-[250px] shadow-2xl" : " object-scale-down w-[300px] h-[250px]"}`}
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
                              <p className="text-gray-700 text-sm">
                                {game.platform} | {game.gameType}
                              </p>
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
                      <p className="text-gray-600 text-sm mb-2">{game.Notes}</p>
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
      )}
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
