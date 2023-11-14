import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import {
  formatDateFilter,
  formatSearchOrderBy,
} from "@/libs/utils/server/formatter";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const { recent, keyword, orderBy, filter, page } = Object.fromEntries(
    url.searchParams.entries(),
  );
  const recentDate = formatDateFilter(recent);
  const order = formatSearchOrderBy(orderBy);

  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      orderBy: [
        {
          _relevance: {
            fields: ["name"],
            search: keyword,
            sort: "asc",
          },
        },
      ],
      select: {
        name: true,
        playlists: {
          select: {
            _count: true,
          },
        },
      },
    });

    const playlists = await prisma.playlist.findMany({
      take: 20,
      where: {
        AND: [
          {
            likedBy: {},
          },
          {
            OR: [
              {
                title: {
                  contains: keyword,
                },
              },
              {
                description: {
                  contains: keyword,
                },
              },
              {},
            ],
          },
          {
            createdAt: {
              gte: recentDate,
            },
          },
        ],
      },
      orderBy: [
        {
          _relevance: {
            fields: ["title", "description"],
            search: keyword,
            sort: "desc",
          },
        },
        order,
      ],
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        createdAt: true,
        likedCount: true,
        playedTime: true,
        mood: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            nickname: true,
            profilePic: true,
          },
        },
        authorId: true,
        playedCount: true,
        songs: {
          select: {
            id: true,
            title: true,
            artist: true,
            url: true,
            likedCount: true,
            playedCount: true,
            likedUsers: {
              select: {
                userId: true,
              },
            },
          },
        },
        likedBy: {
          select: {
            userId: true,
            user: {
              select: {
                nickname: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });

    const users = await prisma.user.findMany({
      where: {
        nickname: {
          contains: keyword,
        },
      },
      orderBy: {
        _relevance: {
          fields: ["nickname"],
          search: keyword,
          sort: "asc",
        },
      },
      select: {
        id: true,
        nickname: true,
        profilePic: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "success",
        result: { playlists, categories, users },
      }),
      {
        status: 200,
        statusText: "OK",
      },
    );
  } catch (err) {
    console.log("server error: ", err);
    return new NextResponse(JSON.stringify({ message: "fail" }), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
