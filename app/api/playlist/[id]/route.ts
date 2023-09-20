import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(req: Request) {
  try {
    const pathname = new URL(req.url).pathname.split("/");
    const title = pathname[pathname.length - 1].replace("-", " ");
    const playlist = await prisma.playlist.findUnique({
      where: {
        title,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        description: true,
        songs: {
          select: {
            id: true,
            title: true,
            artist: true,
            thumbnail: true,
            playedCount: true,
            likedUsers: true,
          },
        },
        likedBy: true,
        playCount: true,
      },
    });

    return NextResponse.json(
      {
        data: playlist,
      },
      {
        status: 200,
        statusText: "OK",
      },
    );
  } catch (err) {
    console.log("post detail error: ", err);
    return new NextResponse(
      JSON.stringify({ message: "fail", errorCode: 404 }),
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
}