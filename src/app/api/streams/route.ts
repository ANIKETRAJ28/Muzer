import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/lib/ytRegex";

const streamSchema = z.object({
    createrId: z.string(),
    url: z.string()
});

export async function POST(req: NextRequest) {
    try {
        const data = streamSchema.parse(await req.json());
        const isYt = data.url.match(YT_REGEX);
        if(!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            });
        }
        const exctractedId = data.url.split("?v=")[1];
        const videoDetails = await youtubesearchapi.GetVideoDetails(exctractedId);
        const thumbnail = videoDetails.thumbnail.thumbnails;
        thumbnail.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);
        const streamData = await prismaClient.stream.create({
            data: {
                userId: data.createrId,
                url: data.url,
                exctractedId,
                type: "Youtube",
                title: videoDetails.title,
                bigImg: thumbnail[thumbnail.length - 1].url ?? "https://cdn.icon-icons.com/icons2/1713/PNG/512/iconfinder-videologoplayicon-3993847_112649.png",
                smallImg: (thumbnail.length > 1 ? thumbnail[thumbnail.length - 2].url : "") ?? "https://cdn.icon-icons.com/icons2/1713/PNG/512/iconfinder-videologoplayicon-3993847_112649.png"
            }
        });
        return NextResponse.json({
            ...streamData,
            haveUpvoted: false,
            upvoteCount: 0
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error while adding streams"
        }, {
            status: 411
        });
    }
}

export async function GET(req: NextRequest) {
    const createrId = req.nextUrl.searchParams.get("createrId");
    const streams = await prismaClient.stream.findMany({
        where: { 
            userId: createrId || "" 
        }
    });
    return NextResponse.json({
        streams
    });
}