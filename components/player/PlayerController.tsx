"use client";

import React, { Dispatch, RefObject, useEffect, useState } from "react";
import Image from "next/image";

import VolumeDropdown from "@/components/player/module/VolumeDropdown";
import ListMenuContainer from "@/components/player/module/ListMenuContainer";
import {
  PlayerProps,
  PlayerState,
  PlaylistType,
} from "@/libs/types/common/Song&PlaylistType";
import { useSession } from "next-auth/react";
import { UserSessionType } from "@/libs/types/common/userType";
import { useSetRecoilState } from "recoil";
import { CommonLoginModalState } from "@/libs/recoil/modalAtom";
import { useMutation } from "react-query";
import { postPlaylistLike, postSongLike } from "@/libs/utils/client/fetchers";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@heroicons/react/24/outline";
import useClickOutside from "@/libs/utils/hooks/useClickOutside";

const PlayerController = ({
  playerState,
  setPlayerState,
  playerRef,
  setSongListIndex,
  songListIndex,
  playlist,
}: {
  playerState: PlayerState;
  setPlayerState: Dispatch<React.SetStateAction<PlayerState>>;
  playerRef: RefObject<PlayerProps>;
  songListIndex: number;
  setSongListIndex: Dispatch<React.SetStateAction<number>>;
  playlist: PlaylistType | null;
}) => {
  const playerCur = playerRef?.current;
  const { data: userSession } = useSession() as { data: UserSessionType };
  const setLoginModalOpen = useSetRecoilState(CommonLoginModalState);
  const { userId } = userSession || "";
  const {
    songs: songList,
    likedBy,
    id: playlistId,
  } = playlist || {
    songs: [],
    likedBy: [],
    id: "",
  };

  const {
    playing,
    played,
    duration,
    muted,
    durationSec,
    playedSec,
    isLoading,
  } = playerState;

  const [isVolumeDropdownOpen, setIsVolumeDropdownOpen] = useState(false);
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const router = useRouter();

  const listDropdownRef = React.useRef<HTMLDivElement>(null);

  const isListFirst = songListIndex === 0;
  const isListLast = songListIndex === songList.length - 1;
  const isUserLikedPlaylist =
    likedBy &&
    likedBy.filter((likeItem) => likeItem.userId === userId).length > 0;

  const currentSong = songList[songListIndex];
  const isSongLiked =
    currentSong &&
    currentSong?.likedUsers &&
    currentSong?.likedUsers?.filter((likeItem) => likeItem.userId === userId)
      .length > 0;

  const handlePrev = () => {
    playerCur?.seekTo(playerCur?.getCurrentTime() - 3);
  };

  const handleNext = () => {
    playerCur?.seekTo(playerCur?.getCurrentTime() + 3);
  };

  const handlePrevList = () => {
    if (songListIndex === 0) {
      return;
    }
    setSongListIndex((prev) => prev - 1);
  };

  const handleNextList = () => {
    if (songListIndex === songList.length - 1) {
      return;
    }
    setSongListIndex((prev) => prev + 1);
  };

  const { mutate: playlistLikeMutate } = useMutation({
    mutationFn: () =>
      postPlaylistLike({ playlistId: playlistId || "", userId: userId || "" }),
    onSuccess: () => {
      router.refresh();
    },
  });

  const { mutate: songLikeMutate } = useMutation({
    mutationFn: () =>
      postSongLike({ songId: currentSong?.id || "", userId: userId || "" }),
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleLikePlaylist = async () => {
    if (!userId) {
      setLoginModalOpen(true);
      return;
    }

    if (!playlistId) {
      return;
    }

    playlistLikeMutate();
  };

  const handleLikeSong = async () => {
    if (!userId) {
      setLoginModalOpen(true);
      return;
    }
    songLikeMutate();
  };

  const handleListDropdownOutside = () => {
    setIsListDropdownOpen(false);
  };

  useClickOutside({ ref: listDropdownRef, handler: handleListDropdownOutside });

  useEffect(() => {
    if (songListIndex === songList.length - 1 || songListIndex === 0) {
      return;
    }

    setPlayerState({ ...playerState, playing: true });
  }, []);

  return (
    <div
      className={`w-screen px-5 py-3 bg-white border-t-[1px] border-gray-200 xs:py-3 xs:px-2`}
    >
      <div className={`flex items-center justify-between gap-6 px-5 xs:px-0`}>
        <div
          className={`flex items-center max-w-5xl gap-2 xs:flex-0 xs:w-sm xs:gap-4`}
        >
          {!isListFirst && (
            <button className={`xs:hidden`} onClick={handlePrevList}>
              <Image
                src={`/image/player/prev_song.svg`}
                width={24}
                height={24}
                alt={`prev`}
              />
            </button>
          )}
          <button
            className={`xs:hidden`}
            onClick={() => {
              handlePrev();
            }}
          >
            <Image
              src={`/image/player/prev.svg`}
              width={24}
              height={24}
              alt={`prev`}
            />
          </button>
          <button
            onClick={() => {
              setPlayerState({ ...playerState, playing: !playing });
            }}
          >
            {playing ? (
              <Image
                src={`/image/player/pause.svg`}
                width={24}
                height={24}
                alt={`play`}
              />
            ) : (
              <Image
                src={`/image/player/play.svg`}
                width={24}
                height={24}
                alt={`play`}
              />
            )}
          </button>
          <button className={`xs:hidden`} onClick={handleNext}>
            <Image
              src={`/image/player/next.svg`}
              width={24}
              height={24}
              alt={`next`}
            />
          </button>
          {!isListLast && (
            <button className={`xs:hidden`} onClick={handleNextList}>
              <Image
                src={`/image/player/next_song.svg`}
                width={24}
                height={24}
                alt={`next`}
              />
            </button>
          )}
          <div
            className={`relative flex items-center`}
            onMouseEnter={() => {
              setIsVolumeDropdownOpen(true);
            }}
          >
            <button
              onClick={() => {
                setPlayerState({ ...playerState, muted: !muted });
              }}
            >
              <Image
                src={`/image/player/${!muted ? "volume.svg" : "mute.svg"}`}
                width={24}
                height={24}
                alt={`volume`}
              />
            </button>
            {isVolumeDropdownOpen && (
              <VolumeDropdown
                playerState={playerState}
                setPlayerState={setPlayerState}
                setIsVolumeDropdownOpen={setIsVolumeDropdownOpen}
              />
            )}
          </div>
        </div>
        <div
          className={`flex-1 flex items-center justify-evenly gap-4 xs:flex-0 xs:order-3 xs:gap-0 xs:max-w-fit xs:pr-3`}
        >
          <p className={`text-xs text-gray-900 whitespace-nowrap`}>
            {isLoading ? `loading..` : `${played} / ${duration}`}
          </p>
          <input
            className={`relative w-full h-2 mx-10 rounded-lg xs:hidden focus:appearance-none range`}
            type={`range`}
            value={playedSec}
            max={durationSec}
            onChange={(e) => {
              playerCur?.seekTo(Number(e.target.value));
            }}
          />
        </div>
        <button className={`xs:hidden`}>
          <Image
            src={`/image/player/repeat.svg`}
            width={24}
            height={24}
            alt={`repeat`}
          />
        </button>
        <div
          className={`flex items-center justify-evenly gap-2 xs:justify-start xs:flex-1 xs:gap-3`}
        >
          <div
            className={`album_cover w-8 h-8 bg-gray-300 overflow-hidden  xs:hidden`}
          >
            <Image
              className={`rounded`}
              src={
                playlist?.coverImage || `/image/common/default_cover_image.svg`
              }
              width={32}
              height={32}
              alt={`album_cover`}
            />
          </div>
          <div className={`relative flex items-center`}>
            <button
              className={`xs:order-2 xs:flex-2`}
              onClick={() => {
                if (!songList.length) {
                  return;
                }
                setIsListDropdownOpen(!isListDropdownOpen);
              }}
            >
              <Image
                src={`/image/player/list.svg`}
                alt={`playlists`}
                width={24}
                height={24}
              />
            </button>
            {isListDropdownOpen && (
              <div ref={listDropdownRef}>
                <ListMenuContainer
                  curIndex={songListIndex}
                  songList={songList}
                  setCurIndex={setSongListIndex}
                  playlist={playlist}
                />
              </div>
            )}
          </div>
          <div
            className={`whitespace-nowrap xs:order-1 xs:flex-1 xs:text-center`}
          >
            <p className={`text-xs text-gray-900 font-medium`}>
              {songList[songListIndex]?.title}
            </p>
            <p className={`text-xs text-gray-600 font-normal xs:hidden`}>
              {songList[songListIndex]?.artist}
            </p>
          </div>
          <div className={`flex items-center gap-2 xs:order-2 xs:flex-2`}>
            <button className={`xs:hidden`} onClick={handleLikePlaylist}>
              {isUserLikedPlaylist ? (
                <Image
                  src={`/image/common/playlist_liked.svg`}
                  alt={`playlist_liked`}
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src={`/image/common/playlist_like.svg`}
                  alt={`playlist_like`}
                  width={24}
                  height={24}
                />
              )}
            </button>
            <button onClick={handleLikeSong}>
              {isSongLiked ? (
                <HeartIcon
                  className={`text-primary bg-primary`}
                  width={24}
                  height={24}
                />
              ) : (
                <HeartIcon
                  className={`text-gray-400 bg-white`}
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerController;
