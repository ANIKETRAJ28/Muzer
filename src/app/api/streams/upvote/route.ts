import { prismaClient } from "@/lib/db";
import NEXT_AUTH from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
});

export async function POST(req: NextRequest) {
    const session = await getServerSession(NEXT_AUTH);
    const user = await prismaClient.user.findFirst({
        where: {
            userId: session.user.userId || ""
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
        const r = await req.json();
        console.log("r...", r);
        const data = UpvoteSchema.parse(r);
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
        return NextResponse.json({message: "done"});
    } catch (error) {
        return NextResponse.json({
            message: "Error while upvoting"
        }, {
            status: 403
        });
    }
}