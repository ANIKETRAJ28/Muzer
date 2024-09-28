"use client";

import Link from "next/link"
import { Music } from "lucide-react"

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const AppBar = () => {
    const session = useSession();
    console.log(session.data);
    return (
        <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
            <Link className="flex items-center justify-center" href="#">
                <Music className="h-6 w-6 mr-2 text-violet-400" />
                <span className="font-bold text-xl text-violet-400">MUZER</span>
            </Link>
            <nav>
                {
                    session.data &&
                    <div className="flex items-center space-x-2">
                        <span className="text-violet-400">{`Hii, ${session.data?.user?.name?.split(" ")[0]}`}</span>
                        <Image
                            src="https://avatars.githubusercontent.com/u/133547782?v=4"
                            alt="User avatar"
                            width={32}
                            height={32}
                            className="rounded-full"      
                        />
                        <div onClick={() => signOut()} className="cursor-pointer text-violet-400 hover:text-violet-300 transition-colors font-semibold py-1 px-3 border border-violet-400 rounded-md hover:bg-violet-400 hover:bg-opacity-10">Logout</div>
                    </div>
                }
                { 
                    !session.data && 
                    <div onClick={() => signIn()} className="cursor-pointer text-violet-400 hover:text-violet-300 transition-colors font-semibold py-1 px-3 border border-violet-400 rounded-md hover:bg-violet-400 hover:bg-opacity-10">Login</div> 
                }
            </nav>
        </div>
    );
}