"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { authClient } from "@/app/lib/auth-client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@mui/material";

export default function LibraryPage() {
  // Placeholder games data
  const games = [
    {
      id: "1",
      title: "Elden Ring",
      coverUrl: "/placeholder/120/160",
      platform: "PC",
      notes: "My favorite game.",
    },
    {
      id: "2",
      title: "The Witcher 3: Wild Hunt",
      coverUrl: "/placeholder/120/160",
      platform: "PlayStation 5",
      notes: "My most played game.",
    },
    {
      id: "3",
      title: "Baldur's Gate 3",
      coverUrl: "/placeholder/120/160",
      platform: "PC",
      notes: "A great game.",
    },
    {
      id: "4",
      title: "Cyberpunk 2077",
      coverUrl: "/placeholder/120/160",
      platform: "PC",
      notes: "A bit buggy.",
    },
    {
      id: "5",
      title: "Red Dead Redemption 2",
      coverUrl: "/placeholder/120/160",
      platform: "Xbox Series X",
      notes: "Fantastic.",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  /*const [gameName, getGameName] = useState("");
  const [platform, getPlatform] = useState("");
  const [physOrDig, getPhysOrDig] = useState("");
  const [notes, getNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/gameData");
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        }
        const json = await response.json();
        getGameName(json);
      } catch (error) {
        console.error("Form entry failed", error);
        alert("Form entry failed");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }*/

  return (
    <div className="flex flex-col gap-3 h-screen items-center justify-top bg-purple-400">
      <Header />
      <input
        className="border-3 rounded px-3 py-2 text-black"
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {filteredGames.map((game, i) => (
          <HoverCard key={game.id}>
            <HoverCardTrigger asChild>
              <button
                style={{ width: "300px", height: "100px" }}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-4">
                  <h3
                    className="font-bold text-purple-800 text-lg mb-1 truncate"
                    title={game.title}
                  >
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{game.platform}</p>
                </div>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-gray-600 text-sm mb-2">{game.notes}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
