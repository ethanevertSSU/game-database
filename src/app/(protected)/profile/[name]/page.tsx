"use client";

import React, { use } from "react";
import useSWR from "swr";
import Header from "@/components/Header";
import Image from "next/image";
import cat from "../../../../../public/cat.jpg";
import { steamIcon } from "../../../../../public/steamIcon";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type link = {
  id: string;
  externalPlatformId: string;
  externalPlatformUserName: string;
  platformName: string;
};

export default function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = use(params);
  const { name } = resolvedParams;
  const { data, error, isLoading } = useSWR(`/api/user/${name}`, fetcher);
  if (error) return <div>Error loading data</div>;

  const gamePicture = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${data?.lastSteamGamePlayed?.appId}/header.jpg?`;

  const userDate = data?.user?.memberSince;

  console.log(userDate);

  const date = new Date(userDate);

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;

  return (
    <div className="min-h-screen bg-purple-400">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center font-bold text-3xl">
          Loading Profile...
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header />
          {!data.user ? (
            <div className="flex flex-1 items-center justify-center">
              <div className=" text-3xl text-center">
                User <p className="font-bold inline">&ldquo;{name}&ldquo;</p>{" "}
                not found, please search again.
                <div className="pt-3">
                  <p className="font-bold inline">NOTE</p>: Usernames Are Case
                  Sensitive.
                </div>
              </div>
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
                        <p className="text-purple-800 font-bold text-2xl">0</p>
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
                    </div>
                    <div className="text-gray-700 mb-6 p-2 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded cursor-pointer">
                      {data?.user?.bio}
                    </div>
                    <div className="inline-flex flex-col">
                      <p className="font-bold">Linked Accounts: </p>

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
                              <p className="text-center text-gray-900 text-xl">
                                No Steam account connected. Link your Steam
                                account to see your recent gaming activity.
                              </p>
                            ) : (
                              <p className="text-center text-gray-900 text-xl">
                                No steam activity in the last 2 weeks, play a
                                game to see your latest activity!
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
