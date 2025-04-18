import axios from "axios";

const steamKey = process.env.STEAM_CLIENT_KEY as string;

interface playerSummary {
  response: {
    players: [
      {
        steamid: string;
        communityvisibilitystate: string;
        profilestate: string;
        personaname: string;
        avatar: string;
        avatarmedium: string;
        avatarfull: string;
        avatarhash: string;
        lastlogoff: string;
        personastate: string;
        primaryclanid: string;
        timecreated: number;
        personastateflags: number;
        loccountrycode: string;
      },
    ];
  };
}

export const getSteamPlayerInfo = async (steamId: string) => {
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?`;
  const params = new URLSearchParams();
  params.append("key", steamKey);
  params.append("steamids", steamId);

  const result = await axios.get<playerSummary>(url, {
    params,
  });

  console.log(result.data);

  return result.data;
};

export interface steamGames {
  response: {
    game_count: number;
    games: [
      {
        appid: string;
        name: string;
        playtime_forever: number;
        img_icon_url: string;
        has_community_visible_stats: boolean;
        playtime_windows_forever: number;
        playtime_mac_forever: number;
        playtime_linux_forever: number;
        playtime_deck_forever: number;
        rtime_last_played: number;
        playtime_disconnected: number;
      },
    ];
  };
}

export const getSteamGames = async (steamId: string) => {
  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?`;
  const params = new URLSearchParams();
  params.append("key", steamKey);
  params.append("steamid", steamId);
  params.append("format", "json");
  params.append("include_appinfo", "true");

  const result = await axios.get<steamGames>(url, {
    params,
  });

  console.log(result.data);

  return result.data;
};

interface recentlyPlayedGames {
  response: {
    total_count: number;
    games: [
      {
        appid: number;
        name: string;
        playtime_2weeks: number;
        playtime_forever: number;
        img_icon_url: string;
      },
    ];
  };
}

export const getLastedPlayedSteamGame = async (steamId: string) => {
  const url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?`;

  const params = new URLSearchParams();
  params.append("key", steamKey);
  params.append("steamid", steamId);
  params.append("format", "json");

  const result = await axios.get<recentlyPlayedGames>(url, {
    params,
  });

  console.log("data: ", result.data);

  return result.data;
};
