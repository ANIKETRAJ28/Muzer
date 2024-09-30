import { AppBar } from "@/components/AppBar"
import { Button } from "@/components/ui/button"
import { Music, Mic, Headphones, Radio, Users, Heart } from "lucide-react"


export default async function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <AppBar/>
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-violet-400">
                  MUZER: Your Stage, Your Audience
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Create, stream, and connect through music. For creators and fans alike.
                </p>
              </div>
              <Button className="bg-violet-600 text-white hover:bg-violet-700 text-lg px-8 py-3">
                Get Started
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-violet-400">Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700">
                <Mic className="h-12 w-12 text-violet-400" />
                <h3 className="text-xl font-bold text-gray-100">Create Streams</h3>
                <p className="text-gray-300 text-center">
                  Set up your own music streams easily.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700">
                <Headphones className="h-12 w-12 text-violet-400" />
                <h3 className="text-xl font-bold text-gray-100">Live Performances</h3>
                <p className="text-gray-300 text-center">
                  Enjoy live music from creators.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700">
                <Radio className="h-12 w-12 text-violet-400" />
                <h3 className="text-xl font-bold text-gray-100">Curated Playlists</h3>
                <p className="text-gray-300 text-center">
                  Access unique playlists from creators.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700">
                <Users className="h-12 w-12 text-violet-400" />
                <h3 className="text-xl font-bold text-gray-100">Fan Subscriptions</h3>
                <p className="text-gray-300 text-center">
                  Support your favorite creators.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700">
                <Heart className="h-12 w-12 text-violet-400" />
                <h3 className="text-xl font-bold text-gray-100">Interactive Experiences</h3>
                <p className="text-gray-300 text-center">
                  Engage through live chats and requests.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-700">
                <Music className="h-12 w-12 text-violet-400" />
                <h3 className="text-xl font-bold text-gray-100">Diverse Genres</h3>
                <p className="text-gray-300 text-center">
                  Discover a wide range of music styles.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 MUZER. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <div className="text-xs hover:underline underline-offset-4 text-gray-400">
            Terms of Service
          </div>
          <div className="text-xs hover:underline underline-offset-4 text-gray-400">
            Privacy Policy
          </div>
          <div className="text-xs hover:underline underline-offset-4 text-gray-400">
            Creator Guidelines
          </div>
        </nav>
      </footer>
    </div>
  )
}