import dayjs, { Dayjs, QUnitType } from "dayjs";
import {
  PlaylistMoodType,
  PlaylistType,
} from "@/libs/types/common/Song&PlaylistType";
import { playlistDefault } from "@/libs/utils/client/commonValues";

export const isNowMoreThanTargetTime = (
  startedAt: Dayjs | null | Date,
  targetTime: number,
  unit: QUnitType = "seconds",
) => {
  const now = dayjs(new Date());
  const isMoreThanTargetTime =
    !!startedAt && now.diff(dayjs(startedAt), unit as QUnitType) > targetTime;
  return isMoreThanTargetTime;
};

export const setRecentPlaylistIdLocalStorage = (playlistId: string) => {
  const recentPlaylist = localStorage.getItem("recentPlaylist");
  if (!recentPlaylist) {
    localStorage.setItem("recentPlaylist", JSON.stringify([playlistId]));
    return;
  }
  const recentPlaylistsArr = JSON.parse(recentPlaylist) as Array<string>;
  localStorage.setItem(
    "recentPlaylist",
    JSON.stringify(recentPlaylistsArr.concat(playlistId)),
  );
};

export const filterMoodPlaylists = (
  moodType: PlaylistMoodType,
  playlistArr?: PlaylistType[][],
) => {
  if (!playlistArr) return [];
  const moodPlaylists = playlistArr.filter((playlist) => {
    return (
      playlist.filter((playlist) => playlist.mood.name === moodType).length > 0
    );
  });
  return moodPlaylists.flat();
};

export const fillEmptyPlaylist = (playlistArr: PlaylistType[]) => {
  if (playlistArr.length > 5) {
    return playlistArr;
  }

  const emptyPlaylist = Array(5 - playlistArr.length);
  const defaultPlaylistArr = emptyPlaylist.fill(playlistDefault).map((_, i) => {
    return {
      ...playlistDefault,
      title: `empty${i}`,
    };
  });

  return playlistArr.concat(defaultPlaylistArr as PlaylistType[]);
};