import StreamView from "@/components/StreamView";

export default function Creater({params: { createrId }}: { params: { createrId: string } }) {
    return <StreamView createrId={createrId}/>
}