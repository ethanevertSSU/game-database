"use client";

import React, { use, useState } from "react";
import useSWR, { mutate } from "swr";
import Header from "@/components/Header";
import Image from "next/image";
import cat from "../../../../../public/cat.jpg";
import { steamIcon } from "../../../../../public/steamIcon";
import { toast, Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type link = {
  id: string;
  externalPlatformId: string;
  externalPlatformUserName: string;
  platformName: string;
};

type friend = {
  id: string;
  userId: string;
  followingId: string;
};

type user = {
  id: string;
  name: string;
  image: string;
  bio: string;
};

type game = {
  id: string;
  gameName: string;
  platform: string;
  gameType: string;
  Notes: string;
};

export default function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = use(params);
  const { name } = resolvedParams;
  const { data, error, isLoading } = useSWR(`/api/user/${name}`, fetcher);
  const { data: user, error: userError } = useSWR(`/api/session/`, fetcher);

  const [isStateLoading, setIsStateLoading] = useState(false);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);

  if (error) return <div>Error loading data</div>;
  if (userError) return <div>Error loading user data</div>;

  const friendsList = data?.followingList ?? [];
  console.log(friendsList);

  const allUsers = data?.allUsers;
  const sessionUsername = user?.username;
  // console.log("session: ", sessionUsername);
  const username = data?.user?.name;
  const userId = data?.user?.id;
  // console.log("user: ", username);
  console.log(allUsers);

  const isSearchNameSession = sessionUsername === username;

  const gamePicture = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${data?.lastSteamGamePlayed?.appId}/header.jpg?`;

  const userDate = data?.user?.memberSince;

  const date = new Date(userDate);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  const handleFriendAdd = async () => {
    setIsStateLoading(true);
    try {
      const response = await fetch(`/api/manageFriend/${name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        toast.error(`Failed to add friend ${username}`);
        return;
      }

      await mutate(`/api/user/${name}`);
      toast.success(`Successfully added friend: ${username}`);
      setIsStateLoading(false);
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error(`Error adding friend`);
    }
  };

  const handleFriendRemove = async () => {
    setIsStateLoading(true);
    try {
      const response = await fetch(`/api/manageFriend/${name}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        toast.error(`Failed to remove friend ${username}`);
        return;
      }

      await mutate(`/api/user/${name}`);
      toast.success(`Successfully removed friend: ${username}`);
      setIsStateLoading(false);
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error(`Error removing friend`);
    }
  };

  return (
    <div className="min-h-screen bg-purple-400">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center font-bold text-3xl">
          Loading Profile...
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header />
          <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{username}&lsquo;s Game Library</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                {data?.games?.map((game: game) => (
                  <div
                    key={game.id}
                    className="bg-white border rounded p-2 shadow-md text-sm"
                  >
                    <div className="font-semibold text-purple-800 truncate">
                      {game.gameName}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {game.platform} — {game.gameType}
                    </div>
                    <div className="text-gray-500 text-xs italic truncate">
                      {game.Notes}
                    </div>
                  </div>
                )) || <div>No games found.</div>}
              </div>
              <DialogFooter className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsGameDialogOpen(false)}
                  className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {!data.user ? (
            <div className="flex flex-col justify-start w-full ">
              <div className="pt-3 text-3xl text-center">
                User <p className="font-bold inline">&ldquo;{name}&ldquo;</p>{" "}
                not found, please search again.
                <div className="pt-3">
                  <p className="font-bold inline">NOTE</p>: Usernames Are Case
                  Sensitive.
                </div>
                <br />
                <div className="font-bold">
                  Here is a list of other Profiles To Checkout!
                </div>
              </div>
              {data.allUsers ? (
                <div className="flex flex-col h-[1000px] items-center gap-2 p-4 overflow-y-auto scrollbar-hide">
                  {data.allUsers.map((user: user) => (
                    <div
                      key={user.id}
                      className="flex bg-white items-center w-full gap-4 p-2 border border-gray-200 rounded-md shadow-border"
                    >
                      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-purple-600">
                        <Image
                          src={user.image || cat}
                          alt={user.name || "Username"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <a href={`/profile/${user.name}`}>
                          <h2 className="text-xl   font-semibold">
                            {user.name}
                          </h2>
                        </a>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {user.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className=" text-3xl text-center">
                  User <p className="font-bold inline">&ldquo;{name}&ldquo;</p>{" "}
                  not found, please search again.
                  <div className="pt-3">
                    <p className="font-bold inline">NOTE</p>: Usernames Are Case
                    Sensitive.
                  </div>
                </div>
              )}
            </div>
          ) : (
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
                    <div className="flex flex-col items-center">
                      <h2 className="text-2xl font-bold text-purple-900 mb-2">
                        {data?.user?.name}
                      </h2>
                      {isSearchNameSession ? (
                        <h1 className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition">
                          This is your account
                        </h1>
                      ) : (
                        <div>
                          {!friendsList.find(
                            (friend: friend) => friend.followingId === userId,
                          ) ? (
                            <button
                              onClick={() => handleFriendAdd()}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                              {isStateLoading ? (
                                <div>Adding Friend...</div>
                              ) : (
                                <div>Add Friend</div>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFriendRemove()}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                            >
                              {isStateLoading ? (
                                <div>Removing Friend...</div>
                              ) : (
                                <div>Remove Friend</div>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Member since {formattedDate}
                    </p>

                    {/* Replaced grid layout with vertical tabs */}
                    <div className="flex flex-col w-full max-w-xs text-center">
                      <div
                        className="bg-purple-100 p-4 rounded-t-lg border-b-2 border-purple-300 hover:bg-purple-200 cursor-pointer"
                        onClick={() => setIsGameDialogOpen(true)}
                      >
                        <p className="text-purple-800 font-bold text-2xl">
                          {data?.numGames || 0}
                        </p>
                        <p className="text-purple-600 text-sm">Games</p>
                      </div>
                      <div className="bg-purple-100 p-4 border-b-2 border-purple-300">
                        <p className="text-purple-800 font-bold text-2xl">
                          {data?.numAchievements || 0}
                        </p>
                        <p className="text-purple-600 text-sm">Achievements</p>
                      </div>
                      <div className="flex flex-row justify-around items-stretch bg-purple-100 p-4 border-b-2 border-purple-300 text-center">
                        <div className="flex flex-col justify-center bg-purple-100 p-4 rounded-b-lg text-center flex-1">
                          <p className="text-purple-800 font-bold text-2xl">
                            {data?.numFollowing || 0}
                          </p>
                          <p className="text-purple-600 text-sm">Following</p>
                        </div>

                        <div className="w-px bg-purple-300" />

                        <div className="flex flex-col justify-center bg-purple-100 p-4 rounded-b-lg text-center flex-1">
                          <p className="text-purple-800 font-bold text-2xl">
                            {data?.numfollowers || 0}
                          </p>
                          <p className="text-purple-600 text-sm">Followers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio and Details */}
                  <div className="w-full md:w-2/3">
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-semibold text-purple-800 mb-2">
                        About Me
                      </div>
                    </div>
                    <div className="text-gray-700 mb-6 p-2 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded cursor-pointer">
                      {data?.user?.bio}
                    </div>
                    <div className="inline-flex flex-col">
                      <div className="font-bold">Linked Accounts:</div>
                      {data?.linkedAccounts?.length == 0 ? (
                        <div className="font-bold">NO LINKED ACCOUNTS</div>
                      ) : (
                        <div>
                          {data?.linkedAccounts?.map((link: link) => (
                            <div
                              key={link.id}
                              className="inline-flex justify-between items-center gap-4 border rounded bg-gray-200"
                            >
                              <div className="flex items-center justify-between gap-4 border rounded bg-gray-200 p-1 ">
                                <svg className="size-7">{steamIcon} </svg>
                                <a
                                  className="font-bold text-blue-500 hover:text-blue-700 focus:outline-none focus:shadow-outline hover:underline visited:text-purple-700"
                                  target="_blank"
                                  href={`https://steamcommunity.com/profiles/${link?.externalPlatformId}`}
                                >
                                  {" "}
                                  {link?.externalPlatformUserName}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-xl font-semibold text-purple-800 mb-4">
                        Gaming Activity
                      </h3>
                      {!data?.lastSteamGamePlayed ? (
                        <div className="bg-yellow-100 rounded-lg p-4">
                          <div className="h-32 w-full flex justify-around items-center">
                            {data?.linkedAccounts?.length == 0 ? (
                              <div className="text-center text-gray-900 text-xl">
                                No Steam account connected. Link your Steam
                                account to see your recent gaming activity.
                              </div>
                            ) : (
                              <div className="text-center text-gray-900 text-xl">
                                No steam activity in the last 2 weeks, play a
                                game to see your latest activity!
                              </div>
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
                                  {data?.lastSteamGamePlayed?.gameName}
                                </p>
                              </h1>
                              <h1 className="font-bold text-xl">
                                Time Played:
                                <p className="font-light">
                                  {data?.lastSteamGamePlayed?.hours} Hours{" "}
                                  {data?.lastSteamGamePlayed?.minutes} Minutes
                                </p>
                              </h1>
                            </div>
                            <a
                              href={`https://store.steampowered.com/app/${data?.lastSteamGamePlayed?.appId}`}
                              target="_blank"
                              className="h-32 w-auto flex items-center justify-end"
                            >
                              <Image
                                src={gamePicture}
                                alt={data?.lastSteamGamePlayed?.gameName || " "}
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
              <div>
                <h2 className="text-2xl font-bold text-purple-900 mb-4">
                  Recent Achievements
                </h2>
                {data?.achievements.length === 0 ? (
                  <div className="bg-yellow-100 rounded-lg p-4">
                    <div className="h-32 w-full flex justify-around items-center">
                      {data?.linkedAccounts?.length === 0 ? (
                        <div className="text-center text-gray-900 text-xl">
                          No Steam account connected. Link your Steam account to
                          see your recent gaming activity.
                        </div>
                      ) : (
                        <div className="text-center text-gray-900 text-xl">
                          No achievements added yet. Click on add achievements
                          and choose a game to see your recent achievements.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {[...data?.achievements]
                      .sort((a, b) => b.unlockTime - a.unlockTime)
                      .slice(0, 5)
                      .map((a, index) => (
                        <div
                          key={a.id}
                          className={`p-4 flex items-start gap-4 ${
                            index < a.length - 1
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
                                {a.achievementName}
                              </h3>
                            </div>
                            <div className="text-gray-600 text-sm">
                              {a.achievementDesc}
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>{a.gameNameAchievements}</span>
                              <span>
                                Unlocked:{" "}
                                {new Date(
                                  a.unlockTime * 1000,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
}
