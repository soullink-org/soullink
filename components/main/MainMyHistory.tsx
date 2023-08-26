import React from "react";

import Title from "@/components/common/module/Title";
import { PlaylistType } from "@/types/common/playlistType";
import PlayListSlider from "@/components/main/module/PlayListSlider";

const MainMyHistory = ({ playLists }: { playLists: PlaylistType[] }) => {
  return (
    <section className={`flex flex-col items-start w-full gap-4`}>
      <Title text={`My History`} size={`h1`} />
      <PlayListSlider playLists={playLists} />
    </section>
  );
};

export default MainMyHistory;
