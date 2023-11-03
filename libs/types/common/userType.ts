import { PlaylistType, SongType } from "@/libs/types/common/Song&PlaylistType";
import { Session } from "next-auth";

export interface UserType {
  id: string;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  email: string;
  password: string;
  profilePic: string;
  bio: string;
  isBlocked: boolean;
  blockReason?: string;
  followers: FollowerUserResponseType[] | null;
  following: FollowingUserResponseType[] | null;
  createdPlaylists: PlaylistType[];
  likedSong: {
    id: string;
    title: string;
    author: { id: string; nickname: string };
    songs: SongType[];
  };
  likedPlaylists: PlaylistType[];
  myComments: CommentType[];
  profileComments: CommentType[];
  playedCount: number;
  isEditor?: boolean;
}

export interface CommentType {
  id: string;
  comment: string;
  type: "USER" | "PLAYLIST";
  isPrivate: boolean;
  isDeleted: boolean;
  author: CommentAuthorInterface;
  authorId: string;
  profile?: UserType;
  profileId?: string;
  playlist?: PlaylistType;
  playlistId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  likedBy: {
    user: {
      id: string;
      nickname: string;
      profilePic: string | null;
    };
  }[];
}

export interface PayloadCommentLikeType {
  userId: string;
  commentId: string;
}
export interface PayloadCommentDeleteType extends PayloadCommentLikeType {}

export interface CommentPayloadType {
  userId: string;
  postId: string;
  comment: string;
  isPrivate: boolean;
  isProfile?: boolean;
}

export interface FollowUserResponseType {
  id: string;
  nickname: string;
  profilePic: string | null;
}

export interface FollowerUserResponseType {
  followerId?: string;
  follower: FollowUserResponseType;
}

export interface FollowingUserResponseType {
  followingId?: string;
  following: FollowUserResponseType;
}

export interface CommentAuthorInterface {
  id: string;
  nickname: string;
  profilePic: string | null;
  followers: FollowerUserResponseType[] | null;
  following: FollowingUserResponseType[] | null;
}

export interface UserSessionType extends Session {
  userId?: string;
  userNickname?: string;
  userImage?: string;
}

export interface SignupPayload {
  profilePic: string;
  nickname: string;
  bio: string;
  email: string;
  socialLinks: {
    website: string;
    instagram: string;
    twitter: string;
  };
}

export interface PostFollowType {
  userId: string;
  targetId: string;
}
