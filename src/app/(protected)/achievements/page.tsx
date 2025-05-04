"use client";
import Header from "@/components/Header";
import useSWR, { mutate } from "swr";
import React from "react";

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

export default function Page() {
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

  // console.log(listOfGames);

  const linkedAccounts = listOfLinkedAccounts?.linkedAccounts || [];

  return (
    <div className="min-h-screen bg-purple-400">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center font-bold text-3xl">
          Loading Achievements...
        </div>
      ) : (
        <div className="flex flex-col">
          <Header />

          <div>
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              <p>All Achievements</p>
            </h2>
            {data?.achievements.length === 0 ? (
              <div className="bg-yellow-100 rounded-lg p-4">
                <div className="h-32 w-full flex justify-around items-center">
                  {linkedAccounts?.length === 0 ? (
                    <div className="text-center text-gray-900 text-xl">
                      No Steam account connected. Link your Steam account to see
                      your recent gaming activity.
                    </div>
                  ) : (
                    <div className="text-center text-gray-900 text-xl">
                      No achievements added yet. Click on add achievements and
                      choose a game to see your recent achievements.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {[...data?.achievements]
                  .sort((a, b) => b.unlockTime - a.unlockTime)
                  //.slice(0, 5)
                  .map((a, index) => (
                    <div
                      key={a.id}
                      className={`p-4 flex items-start gap-4 ${
                        index < a.length - 1 ? "border-b border-gray-200" : ""
                      }`}
                    >
                      <div className="bg-purple-200 rounded-full p-3 h-12 w-12 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-700 text-xl">🏆</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-bold text-purple-800">
                            {a.achievementName}
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm">
                          {a.achievementDesc}
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>{a.gameNameAchievements}</span>
                          <span>
                            Unlocked:{" "}
                            {new Date(a.unlockTime * 1000).toLocaleDateString()}
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
  );
}
