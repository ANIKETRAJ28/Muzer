import { prismaClient } from "@/lib/db";
import NEXT_AUTH from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(NEXT_AUTH);
    const user = await prismaClient.user.findFirst({
        where: {
            userId: session.user.userId || "",
        }
    });
    if(!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }
    const mostUpVotedStream = await prismaClient.stream.findFirst({
        where: {
            userId: user.id,
            played: false
        },
        orderBy: {
            upvotes: {
                _count: 'desc'
            }
        }
    });

    console.log("most upvoted stream...", mostUpVotedStream);

    await Promise.all([prismaClient.currentStream.upsert({
        where: {
            userId: user.id,
        },
        update: {

            streamId: mostUpVotedStream?.id
        },
        create: {
            userId: user.id,
            streamId: mostUpVotedStream?.id,
        }
    }), prismaClient.stream.update({
        where: {
            id: mostUpVotedStream?.id
        },
        data: {
            played: true,
            playedTs: new Date()
        }
    })]);

    return NextResponse.json({stream: mostUpVotedStream});
}