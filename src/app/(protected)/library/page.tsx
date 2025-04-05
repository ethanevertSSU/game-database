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

type Game = {
  id: string;
  gameName: string;
  platform: string;
  gameType: string;
  Notes: string | null;
  gamePicture: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GameList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // used for editing the notes of a game
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editedNotes, setEditedNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, mutate } = useSWR<{ game: Game[] }>(
    "/api/library",
    fetcher,
  );

  const games = data?.game || [];

  const handleSearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = games.filter(
    (game) =>
      game.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.gameType.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                <HoverCardTrigger
                  asChild
                  onClick={() => {
                    setSelectedGame(game);
                    setEditedNotes(game.Notes || "");
                  }}
                >
                  <button
                    style={{ width: "300px", height: "250px" }}
                    className="text-left bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                  >
                    <div className="p-4">
                      <div className="relative h-40 w-full">
                        {game.gamePicture ? (
                          <Image
                            src={game.gamePicture}
                            alt={game.gameName}
                            width={300}
                            height={250}
                            className="object-cover rounded shadow-2xl"
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

          {/* Inline Save / Cancel */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setSelectedGame(null);
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
                      body: JSON.stringify({ Notes: editedNotes }),
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
                            ? { ...g, Notes: editedNotes }
                            : g,
                        ),
                      };
                    },
                    false, //this means no full refresh
                  );
                  setSelectedGame(null);
                  setEditedNotes("");
                } catch (error) {
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

                    if (!res.ok) toast("Failed to delete game");

                    toast("Game deleted.");
                    await mutate((currentData) => {
                      if (!currentData) return { game: [] };
                      return {
                        game: currentData.game.map((g) => g),
                      };
                    });
                    setSelectedGame(null);
                    setEditedNotes("");
                  } catch (err) {
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
