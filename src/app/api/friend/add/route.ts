
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const email = body.email;
        // const { email } = z.string().email().parse(body.email
    
        const idToAdd = await (fetchRedis('get', `user:email:${email}`)) as string
        console.log('id TO add')

        if (!idToAdd) {
            return new Response('This person does not exist.', { status: 400 })
        }

        const session = await getServerSession(authOptions);
        if(!session) return new  Response('Unauthorized', { status: 401 })
        if(idToAdd == session.user.id) {
            return new Response('You cannot add yourself as friend', { status: 400 })
        }

        // logged in user is already present in the friend list of the user to which request is being sent
        const isAlreadyAdded = ( await fetchRedis(
            'sismember', 
            `user:${idToAdd}:incoming_friend_requests`, 
            session.user.id
        )) as 0 | 1;

        if(isAlreadyAdded) {
            return new Response('Already added user', { status: 400})
        }

        const isAlreadyFriend = ( await fetchRedis(
            'sismember', 
            `user:${session.user.id}:friends`, 
            idToAdd
        )) as 0 | 1;

        if(isAlreadyAdded) {
            return new Response('Already friend with the user', { status: 400})
        }

        db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id)        

        return NextResponse.json({ message: "This Worked", success: true });

    } catch(err) {

    } 
}