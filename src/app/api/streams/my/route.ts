import { prismaClient } from "@/lib/db";
import NEXT_AUTH from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    try {
        const streams = await prismaClient.stream.findMany({
            where: {
                userId: user.id
            },
            include: {
                _count: {
                    select: {
                        upvotes: true
                    }
                },
                upvotes: {
                    where: {
                        userId: user.id
                    }
                }
            }
        });
        return NextResponse.json({
            streams: streams.map(({_count, ...res}) => ({
                ...res,
                upvoteCount: _count.upvotes,
                haveUpvoted: res.upvotes.length ? true : false
            }))
        });
    } catch (error) {
        throw error;
    }
}