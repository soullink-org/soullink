import React from "react";
import MainTrending from "@/components/main/MainTrending";
import MainFriendsPlaylists from "@/components/main/MainFriendsPlaylists";
import MainHotTracks from "@/components/main/MainHotTracks";
import MainMyHistory from "@/components/main/MainMyHistory";
import { PlaylistType } from "@/libs/types/common/Song&PlaylistType";

const MainTemplate = ({
  propsData: { trendingPlayLists, friendsPlayLists, popularTracks, myHistory },
}: {
  propsData: {
    trendingPlayLists: PlaylistType[];
    friendsPlayLists: PlaylistType[];
    popularTracks: PlaylistType;
    myHistory: PlaylistType[];
  };
}) => {
  return (
    <div className={`flex flex-col items-start gap-y-12 `}>
      <MainTrending playLists={trendingPlayLists} />
      <MainFriendsPlaylists playLists={friendsPlayLists} />
      <MainHotTracks trendingsongList={popularTracks} />
      <MainMyHistory playLists={myHistory} />
    </div>
  );
};

export default MainTemplate;
