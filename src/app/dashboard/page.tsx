"use client"

import StreamView from "@/components/StreamView";

// const REFRESH_INTERVAL_MS = 10*1000;

export default function Dashboard() {
  const createrId = "da296102-e1c1-49cb-90aa-78eeb7000cc2";

  return <StreamView createrId={createrId}/>
}