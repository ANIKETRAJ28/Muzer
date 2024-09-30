"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import Image from "next/image";
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { YT_REGEX } from "@/lib/ytRegex";
// import { toast } from "@/components/ui/"

const REFRESH_INTERVAL_MS = 10*1000;

type Song = {
  id: string
  title: string
  url: string
  votes: number
  thumbnailUrl: string,
  haveUpvoted: boolean | null
}

export default function StreamView({ createrId }: { createrId: string }) {
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newSongUrl, setNewSongUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function refreshStream() {
    try {
      const res = await axios.get(`/api/streams?createrId=${createrId}`);
      setQueue( 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          res.data.streams.map((stream: any) => ({
          id: stream.id,
          title: stream.title,
          url: stream.url,
          votes: stream.upvoteCount,
          thumbnailUrl: stream.bigImg,
          haveUpvoted: stream.haveUpvoted
        })).sort((a: Song, b: Song) => b.votes - a.votes)
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (queue.length > 0 && !currentSong) {
      setCurrentSong(queue[0])
    }
  }, [queue, currentSong])

  useEffect(() => {
    refreshStream();
    setInterval(() => {
        refreshStream();
    }, REFRESH_INTERVAL_MS);
  }, []);

  const addSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newSongUrl) return;
    setIsLoading(true);
    const res = await axios.post(`/api/streams/?createrId=${createrId}`, {
      createrId,
      url: newSongUrl
    });
    setQueue([...queue, {
      id: res.data.id,
      title: res.data.title,
      url: res.data.url,
      votes: res.data.upvoteCount,
      thumbnailUrl: res.data.bigImg,
      haveUpvoted: res.data.haveUpvoted
    }]);
    setIsLoading(false);
    setNewSongUrl("");
  }

//   const copyShareableLink = () => {
//     navigator.clipboard.writeText(window.location.href).then(() => {
//       toast({
//         title: "Link Copied!",
//         description: "The sharable link has been copied to your clipboard.",
//         duration: 3000,
//       })
//     }, (err) => {
//       console.error('Could not copy text: ', err)
//       toast({
//         title: "Error",
//         description: "Failed to copy the link. Please try again.",
//         duration: 3000,
//       })
//     })
//   }

  const vote = async(id: string, hasVote: boolean) => {
    try {
      await axios.post(`/api/streams/${hasVote ? "downvote": "upvote"}`, {
        streamId: id
      });
    } catch (error) {
      console.log(error);
    }
    setQueue(
      queue.map((song) =>
        song.id === id ? {
          ...song,
          votes: hasVote ? song.votes-1 : song.votes+1,
          haveUpvoted: !song.haveUpvoted
        } : song
      ).sort((a, b) => b.votes - a.votes)
    );
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const nextSong = () => {
    const currentIndex = queue.findIndex((song) => song.id === currentSong?.id)
    if (currentIndex < queue.length - 1) {
      setCurrentSong(queue[currentIndex + 1])
    }
  }

  const previousSong = () => {
    const currentIndex = queue.findIndex((song) => song.id === currentSong?.id)
    if (currentIndex > 0) {
      setCurrentSong(queue[currentIndex - 1])
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-violet-400">Music Queue Dashboard</h1>
        {/* <div className="flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-violet-400">Music Queue Dashboard</h1>
          <Button onClick={copyShareableLink} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div> */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-violet-400">Now Playing</CardTitle>
          </CardHeader>
          <CardContent>
            {currentSong ? (
              <div className="space-y-4">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${currentSong.url.split("v=")[1]}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-300 text-center sm:text-left">{currentSong.title}</h2>
                  <div className="flex space-x-2">
                    <Button onClick={previousSong} className="bg-violet-600 hover:bg-violet-700 text-white">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button onClick={togglePlayPause} className="bg-violet-600 hover:bg-violet-700 text-white">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button onClick={nextSong} className="bg-violet-600 hover:bg-violet-700 text-white">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-400">No song playing</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-violet-400">Add Song to Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  type="text"
                  placeholder="Enter YouTube URL"
                  value={newSongUrl}
                  onChange={(e) => setNewSongUrl(e.target.value)}
                  className="bg-gray-700 text-gray-300 placeholder-gray-400 border-gray-600 flex-grow"
                />
                <Button 
                  onClick={addSong}
                  disabled={isLoading}
                  className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
                >
                  { isLoading ? "Loading..." : "Add"}
                </Button>
              </div>
              {newSongUrl && newSongUrl.match(YT_REGEX) &&
                <LiteYouTubeEmbed 
                  title="" 
                  id={newSongUrl.split("?v=")[1]}
                />
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-violet-400">Song Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {queue.map((song) => (
                <li key={song.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 p-4 rounded-lg shadow space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Image src={song.thumbnailUrl} alt={song.title} width={120} height={90} className="rounded w-full sm:w-auto" />
                    <div className="flex flex-col justify-between h-full">
                      <span className="font-medium text-gray-300 text-sm sm:text-base">{song.title}</span>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => vote(song.id, song.haveUpvoted ?? true)} className={`${song.haveUpvoted ? "bg-violet-400 text-white" : "text-violet-400 border-violet-400"}`}>
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <span className="text-gray-300 min-w-[2ch] text-center">{song.votes}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}