"use client";

import Header from "../components/Header";
import { steamLogo } from "../../public/steam";

export default function Home() {
  return (
    <div className=" bg-purple-400 h-screen grid grid-rows-[auto_1fr_auto] gap-y-36">
      <Header />
      <div className="place-items-center">
        <ul className="flex flex-col gap-16 text-center">
          <li className="font-bold text-4xl text-wrap">
            The JEBBS Game Database lets you gather all of your games from
            supported platforms so you can visualize your collection in one
            place!
          </li>
          <li className="flex flex-col gap-4 items-center">{steamLogo}</li>
          <li className="font-bold text-4xl">
            Search for, and add games with ease using key words or tags.
          </li>
          <li className="font-bold text-4xl">
            Share your collection with your friends and celebrate your gaming
            achievements!
          </li>
        </ul>
      </div>
    </div>
  );
}
