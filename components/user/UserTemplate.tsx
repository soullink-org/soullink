"use client";

import React from "react";
import { UserSessionType, UserType } from "@/libs/types/common/userType";
import UserHeader from "@/components/user/module/UserHeader";
import Title from "@/components/common/module/Title";
import PlayListSlider from "@/components/common/playlist/PlayListSlider";
import CommentContainer from "@/components/common/comments/CommentContainer";
import { useSession } from "next-auth/react";

const UserTemplate = ({ userProps }: { userProps: UserType }) => {
  const { data: session } = useSession() as { data: UserSessionType };
  const { nickname, createdPlaylists, id: profileId } = userProps;
  const isPlaylistsEmpty = createdPlaylists?.length === 0;

  return (
    <section className={`flex flex-col items-center gap-10 pb-10`}>
      <UserHeader userProfile={userProps} />
      <div
        className={`flex flex-col gap-3 items-start w-full text-gray-900 mt-[520px]`}
      >
        <Title size={`h1`} text={`${nickname}'s Playlist`} />
        {!isPlaylistsEmpty && <PlayListSlider playLists={createdPlaylists} />}
        {isPlaylistsEmpty && <Title size={`h2`} text={`No Playlists`} />}
      </div>
      <div className={`flex flex-col gap-3 items-start w-full text-gray-900`}>
        <Title size={`h2`} text={`Guestbook`} />
        <CommentContainer
          postId={profileId}
          userId={session?.userId}
          isProfile={true}
        />
      </div>
    </section>
  );
};

export default UserTemplate;
