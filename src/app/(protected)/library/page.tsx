"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import useSWR from "swr";
import Image from "next/image";

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

  const { data, isLoading } = useSWR<{ game: Game[] }>("/api/library", fetcher);

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
                <HoverCardTrigger asChild>
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
              href="/form"
            >
              form
            </Link>{" "}
          </div>
        </div>
      )}
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
    </div>
  );
};

export default GameList;
