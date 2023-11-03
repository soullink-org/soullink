import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(req: Request) {
  try {
    const userId = new URL(req.url).searchParams.get("userId") || "";

    if (!userId) {
      const nonLoginSuggestions = await prisma.playlist.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          coverImage: true,
          createdAt: true,
          likedCount: true,
          author: {
            select: {
              id: true,
              nickname: true,
              profilePic: true,
              isEditor: true,
            },
          },
          likedBy: {
            select: {
              userId: true,
              user: {
                select: {
                  id: true,
                  nickname: true,
                  profilePic: true,
                  isEditor: true,
                },
              },
            },
          },
          songs: {
            select: {
              id: true,
              title: true,
              artist: true,
              url: true,
              likedCount: true,
            },
          },
          mood: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      });

      const categoriesRes = await prisma.category.findMany({
        select: {
          name: true,
        },
      });

      const categories = categoriesRes.map((category) => category.name);

      return new NextResponse(
        JSON.stringify({
          message: "success",
          categoryPlaylists: nonLoginSuggestions,
          categories,
        }),
        {
          status: 200,
          statusText: "OK",
        },
      );
    }

    const userLikedPlaylists = await prisma.playlist.findMany({
      where: {
        likedBy: {
          every: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        category: true,
      },
    });

    const userFavoriteCategories = userLikedPlaylists
      .map((playlist) => {
        return playlist.category.map((category) => {
          return category.name;
        });
      })
      .flat();

    const categoryPlaylists = await prisma.playlist.findMany({
      where: {
        category: {
          every: {
            name: {
              in: userFavoriteCategories,
            },
          },
        },
      },
      orderBy: {
        likedCount: "desc",
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        likedCount: true,
        author: {
          select: {
            id: true,
            nickname: true,
            profilePic: true,
            isEditor: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        songs: {
          select: {
            id: true,
            title: true,
            artist: true,
            url: true,
            likedCount: true,
          },
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "success",
        categoryPlaylists,
        categories: userFavoriteCategories,
      }),
      {
        status: 200,
        statusText: "OK",
      },
    );
  } catch (err) {
    console.log("write.ts error: ", err);
    return new NextResponse(JSON.stringify({ message: "fail" }), {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}