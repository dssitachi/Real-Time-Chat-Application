import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        
        const body = await req.json();
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        const isAlreadyFriends = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd)
        if (isAlreadyFriends) {
            return new Response("Already Friends", { status: 400 })
        }

        const isFriendRequestSent = await fetchRedis(
            "sismember",
            `user:${session.user.id}:incoming_friend_requests`,
            idToAdd
        )
        
        if(!isFriendRequestSent) {
            return new Response('No friend request', { status: 400 })
        }
        console.log('here')
        await db.sadd(`user:${session.user.id}:friends`, idToAdd);
        await db.sadd(`user:${idToAdd}:friends`, session.user.id);
        
        // await db.srem(`user:incoming_friend_requests`, session.user.id)
        await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

        return new Response("OK")
    } catch (err) {
        console.log(err)
    }
}