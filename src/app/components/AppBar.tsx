"use client";

import { signIn, signOut, useSession } from "next-auth/react"

export const AppBar = () => {
    const session = useSession();
    return (
        <div className="flex justify-between">
            <div>
                Muzer
            </div>
            <div>
                { session.data && <button className="m-2 p-2 bg-blue-400" onClick={() => signOut()}>Logout</button> }
                { !session.data && <button className="m-2 p-2 bg-blue-400" onClick={() => signIn()}>Login</button> }
                
            </div>
        </div>
    );
}