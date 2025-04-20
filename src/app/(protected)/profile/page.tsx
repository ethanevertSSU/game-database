"use client";
import Image from "next/image";
import Header from "@/components/Header";
import cat from "../../../../public/cat.jpg";
import useSWR, { mutate } from "swr";
import React from "react";
import Link from "next/link";
import { steamIcon } from "../../../../public/steamIcon";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type link = {
  id: string;
  externalPlatformId: string;
  externalPlatformUserName: string;
  platformName: string;
};

type returnURL = {
  url: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfilePage() {
  const { data, isLoading } = useSWR("/api/profile", fetcher);

  const { data: returnURL } = useSWR<returnURL>("api/url", fetcher);

  const { data: listOfLinkedAccounts, isLoading: loadingLinkedAccounts } =
    useSWR<{ linkedAccounts: link[] }>("/api/linkedaccounts", fetcher);

  const { data: mostRecentGame, isLoading: loadingRecentGame } = useSWR(
    "/api/recentGame",
    fetcher,
  );
  const linkedAccountNames =
    listOfLinkedAccounts?.linkedAccounts.map(
      (link) => link.externalPlatformUserName,
    ) || [];

  const { data: listOfGames } = useSWR(
    `/api/getGames/${linkedAccountNames}`,
    fetcher,
  );

  console.log(listOfGames);

  const recentGames = mostRecentGame ?? [];

  const steamReturnURL = returnURL?.url;
  const gamePicture = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${recentGames.appId}/header.jpg?`;

  // Function to handle unlink (DELETE request)
  const handleUnlink = async (accountId: string) => {
    try {
      const response = await fetch(`/api/linkedaccounts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });

      console.log(response);

      if (!response.ok) {
        toast("Failed to unlink account");
        return;
      }

      // Revalidate data after deletion
      await mutate("/api/linkedaccounts");
      await mutate("/api/profile");
      await mutate("/api/recentGame");
      toast(`Account removed successfully`);
    } catch (error) {
      console.error("Error unlinking account:", error);
    }
  };

  const handleAchievementAdd = async (
    appId: string,
    steamId: string,
    gameName: string,
  ) => {
    try {
      const response = await fetch("/api/getAchievements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, steamId }),
      });

      if (!response.ok) {
        toast(`Failed to add achievement for game: ${gameName}`);
        return;
      }

      const data = await response.json();

      toast(
        `Successfully added ${data?.numAchievements} achievements from ${gameName}`,
      );
    } catch (error) {
      console.error("Error adding achievement:", error);
    }
  };

  const linkedAccounts = listOfLinkedAccounts?.linkedAccounts || [];

  const userDate = data?.user?.createdAt;
  const date = new Date(userDate);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  // Placeholder user data
  const user = {
    id: "1",
    username: "GamerX2024",
    avatarUrl: "/placeholder/150/150", // Placeholder avatar
    joinedDate: "2022-03-15",
    level: 42,
    totalGamesPlayed: 127,
    totalAchievements: 384,
    bio: "Avid gamer since 2010. I love RPGs, strategy games, and occasionally dabble in FPS games. Always looking for new gaming buddies!",
  };

  // Bio editing state
  const [isEditingBio, setIsEditingBio] = React.useState(false);
  const [editedBio, setEditedBio] = React.useState(data?.user?.bio || user.bio);
  const [isSavingBio, setIsSavingBio] = React.useState(false);

  // Placeholder top games data
  const topGames = [
    {
      id: "1",
      title: "Elden Ring",
      coverUrl: "/placeholder/120/160",
      playtime: 237,
      lastPlayed: "2024-02-28",
      platform: "PC",
      rating: 5,
    },

    {
      id: "2",
      title: "The Witcher 3: Wild Hunt",
      coverUrl: "/placeholder/120/160",
      playtime: 189,
      lastPlayed: "2024-01-15",
      platform: "PlayStation 5",
      rating: 5,
    },
    {
      id: "3",
      title: "Baldur's Gate 3",
      coverUrl: "/placeholder/120/160",
      playtime: 156,
      lastPlayed: "2024-02-10",
      platform: "PC",
      rating: 5,
    },
    {
      id: "4",
      title: "Cyberpunk 2077",
      coverUrl: "/placeholder/120/160",
      playtime: 92,
      lastPlayed: "2023-12-20",
      platform: "PC",
      rating: 4,
    },
    {
      id: "5",
      title: "Red Dead Redemption 2",
      coverUrl: "/placeholder/120/160",
      playtime: 88,
      lastPlayed: "2023-11-05",
      platform: "Xbox Series X",
      rating: 5,
    },
  ];

  // Placeholder achievements data
  const achievements = [
    {
      id: "1",
      title: "Marathon Gamer",
      description: "Played for 24 hours straight",
      unlockedDate: "2023-07-15",
      rarity: "Rare",
      game: "Elden Ring",
    },
    {
      id: "2",
      title: "Completionist",
      description: "Completed all side quests in a single game",
      unlockedDate: "2023-09-22",
      rarity: "Legendary",
      game: "The Witcher 3: Wild Hunt",
    },
    {
      id: "3",
      title: "First Day Adopter",
      description: "Played a game on its release day",
      unlockedDate: "2024-01-30",
      rarity: "Common",
      game: "Baldur's Gate 3",
    },
    {
      id: "4",
      title: "Social Butterfly",
      description: "Added 50 friends to your network",
      unlockedDate: "2023-11-05",
      rarity: "Uncommon",
      game: "Global",
    },
    {
      id: "5",
      title: "Night Owl",
      description: "Played between 2AM and 4AM",
      unlockedDate: "2024-02-18",
      rarity: "Common",
      game: "Cyberpunk 2077",
    },
  ];

  return (
    <div className="min-h-screen bg-purple-400">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center font-bold text-3xl">
          Loading Profile...
        </div>
      ) : (
        <div className="flex flex-col">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-purple-600">
                    <Image
                      src={data?.user?.image || cat}
                      alt={data?.user?.name || "Username"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-900 mb-2">
                    {data?.user?.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Member since {formattedDate}
                  </p>

                  {/* Replaced grid layout with vertical tabs */}
                  <div className="flex flex-col w-full max-w-xs text-center">
                    <div className="bg-purple-100 p-4 rounded-t-lg border-b-2 border-purple-300  ">
                      <p className="text-purple-800 font-bold text-2xl">
                        {data?.numGames || 0}
                      </p>
                      <p className="text-purple-600 text-sm">Games</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-b-lg">
                      <p className="text-purple-800 font-bold text-2xl">
                        {user.totalAchievements}
                      </p>
                      <p className="text-purple-600 text-sm">Achievements</p>
                    </div>
                  </div>
                </div>

                {/* Bio and Details */}
                <div className="w-full md:w-2/3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-purple-800 mb-2">
                      About Me
                    </h3>
                    <button
                      onClick={() => {
                        setIsEditingBio(true);
                        setEditedBio(data?.user?.bio || user.bio);
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      Edit Bio
                    </button>
                  </div>
                  <div
                    className="text-gray-700 mb-6 p-2 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => {
                      setIsEditingBio(true);
                      setEditedBio(data?.user?.bio || user.bio);
                    }}
                  >
                    {data?.user?.bio || user.bio}
                  </div>

                  {/* Bio Edit Dialog */}
                  <Dialog
                    open={isEditingBio}
                    onOpenChange={(open) => !open && setIsEditingBio(false)}
                  >
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Your Bio</DialogTitle>
                      </DialogHeader>

                      <textarea
                        className="w-full border rounded p-2 text-black mt-2"
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        rows={6}
                        placeholder="Tell us about yourself..."
                      />

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setIsEditingBio(false);
                            setEditedBio(data?.user?.bio || user.bio);
                          }}
                          className="text-sm text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={isSavingBio}
                          onClick={async () => {
                            setIsSavingBio(true);
                            try {
                              const response = await fetch("/api/profile/bio", {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ bio: editedBio }),
                              });

                              if (!response.ok) toast("Failed to update bio");

                              // Update local state and close dialog
                              await mutate("/api/profile");
                              toast("Bio updated successfully!");
                              setIsEditingBio(false);
                            } catch (error) {
                              console.error("Error updating bio:", error);
                              toast(
                                "Something went wrong while updating your bio.",
                              );
                            } finally {
                              setIsSavingBio(false);
                            }
                          }}
                          className="text-sm bg-purple-600 hover:bg-purple-800 text-white px-3 py-1 rounded"
                        >
                          {isSavingBio ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {loadingLinkedAccounts ? (
                    <p>Loading Steam Info...</p>
                  ) : (
                    <div className="inline-flex flex-col">
                      <p className="font-bold">Linked Accounts: </p>
                      {linkedAccounts.map((link) => (
                        <div
                          key={link.id}
                          className="inline-flex justify-between items-center gap-4 border rounded bg-gray-200"
                        >
                          <div className="flex items-center justify-between gap-4 border rounded bg-gray-200 p-1 ">
                            <svg className="size-7">{steamIcon} </svg>
                            <a
                              className="font-bold text-blue-500 hover:text-blue-700 focus:outline-none focus:shadow-outline hover:underline visited:text-purple-700"
                              target="_blank"
                              href={`https://steamcommunity.com/profiles/${link.externalPlatformId}`}
                            >
                              {" "}
                              {link.externalPlatformUserName}
                            </a>
                            <Dialog>
                              <DialogTrigger>
                                <p className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                                  Add Achievements
                                </p>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl w-full">
                                <DialogHeader>
                                  <DialogTitle>Add Achievements</DialogTitle>
                                  <DialogDescription>
                                    Please pick the specific games you would
                                    like to have achievements added.
                                    {listOfGames?.error ? (
                                      <p>
                                        NO GAMES, PLEASE MAKE SURE YOUR ACCOUNT
                                        IS ON A PUBLIC STATUS
                                      </p>
                                    ) : (
                                      <div className="overflow-scroll max-w-full max-h-[600px]">
                                        {listOfGames?.games?.[
                                          link.externalPlatformUserName
                                        ]?.map((game) => (
                                          <div
                                            key={game.gameName}
                                            className=" py-[1px]"
                                          >
                                            <div className="flex flex-row justify-between items-center rounded bg-gray-200 py-2">
                                              <div className="text-nowrap font-bold hover:underline">
                                                {game.gameName}
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  handleAchievementAdd(
                                                    game.externalAppId as string,
                                                    link.externalPlatformId,
                                                    game.gameName,
                                                  )
                                                }
                                                className="text-nowrap bg-green-600 text-white px-2 py-2 rounded-md hover:bg-green-700 transition"
                                              >
                                                Add Achievements
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </DialogDescription>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                            <Dialog>
                              <DialogTrigger>
                                <p className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                                  unlink
                                </p>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Unlinking Steam Account
                                  </DialogTitle>
                                  <DialogDescription>
                                    Unlinking this steam account will remove all
                                    games in your library that are associated
                                    with this steam account!
                                  </DialogDescription>
                                  <button
                                    type="button"
                                    onClick={() => handleUnlink(link.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                  >
                                    I understand, unlink my steam account
                                  </button>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                      <Dialog>
                        <DialogTrigger>
                          <p className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                            Link Steam Account
                          </p>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Make Steam Account Public</DialogTitle>
                            <DialogDescription className="font-medium">
                              Please make sure that your steam account is set to
                              public before clicking on the button below. If you
                              do not set your account to public it will link to
                              your JEBBS account, but you games will not import.
                              <br />
                              <br />
                              <a
                                className="text-blue-600 hover:underline visited:text-purple-600"
                                target="_blank"
                                href="https://support.challengermode.com/en/start-here/make-your-steam-profile-public"
                              >
                                {" "}
                                Here is a link to a guide on how to make your
                                steam account public
                              </a>
                            </DialogDescription>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                              <Link
                                href={`https://steamcommunity.com/openid/login?openid.mode=checkid_setup&openid.ns=http://specs.openid.net/auth/2.0&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.return_to=${steamReturnURL}/api/steam/`}
                              >
                                I Understand, Link Steam Account
                              </Link>
                            </button>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">
                      Gaming Activity
                    </h3>
                    {recentGames.error || loadingRecentGame ? (
                      <div className="bg-yellow-100 rounded-lg p-4">
                        <div className="h-32 w-full flex justify-around items-center">
                          {recentGames.status == "500" && (
                            <p className="text-center text-gray-900 text-xl">
                              No Steam account connected. Link your Steam
                              account to see your recent gaming activity.
                            </p>
                          )}
                          {recentGames.status == "401" && (
                            <p className="text-center text-gray-900 text-xl">
                              No steam activity in the last 2 weeks, play a game
                              to see your latest activity!
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-purple-100 rounded-lg p-4">
                        <div className="h-32 w-full flex justify-around items-center">
                          <div className="flex flex-col text-nowrap font-bold">
                            <h1 className="font-bold text-xl">
                              Game:
                              <p className="font-light">
                                {recentGames.gameName}
                              </p>
                            </h1>
                            <h1 className="font-bold text-xl">
                              Time Played:
                              <p className="font-light">
                                {recentGames.hours} Hours {recentGames.minutes}{" "}
                                Minutes
                              </p>
                            </h1>
                          </div>
                          <a
                            href={`https://store.steampowered.com/app/${recentGames.appId}`}
                            target="_blank"
                            className="h-32 w-auto flex items-center justify-end"
                          >
                            <Image
                              src={gamePicture}
                              alt={recentGames.gameName || " "}
                              width={300}
                              height={300}
                              className="object-cover rounded shadow-lg items-end"
                            />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Games Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                Top 5 Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {topGames.map((game) => (
                  <div
                    key={game.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={game.coverUrl}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-bold text-purple-800 text-lg mb-1 truncate"
                        title={game.title}
                      >
                        {game.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {game.platform}
                      </p>

                      <div className="flex justify-between text-sm text-gray-700">
                        <span>{game.playtime} hours</span>
                        <span className="text-purple-600">
                          {"★".repeat(game.rating)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Last played:{" "}
                        {new Date(game.lastPlayed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Section */}
            <div>
              <h2 className="text-2xl font-bold text-purple-900 mb-4">
                Recent Achievements
              </h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={`p-4 flex items-start gap-4 ${
                      index < achievements.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <div className="bg-purple-200 rounded-full p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-700 text-xl">🏆</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-purple-800">
                          {achievement.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            achievement.rarity === "Common"
                              ? "bg-gray-200 text-gray-700"
                              : achievement.rarity === "Uncommon"
                                ? "bg-green-200 text-green-800"
                                : achievement.rarity === "Rare"
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-purple-200 text-purple-800"
                          }`}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {achievement.description}
                      </p>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{achievement.game}</span>
                        <span>
                          Unlocked:{" "}
                          {new Date(
                            achievement.unlockedDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
}
