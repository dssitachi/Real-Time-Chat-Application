import FriendRequests from "@/components/FriendRequests";
import AddFriend from "@/components/addFriend";
import { authOptions } from "@/lib/auth";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function page() {
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const incomingSenderIds = (await fetchRedis(
        "smembers",
        `user:${session.user.id}:incoming_friend_requests`
    )) as string[];

    const incomingFriendRequest = await Promise.all(
        incomingSenderIds.map(async function fetchUser(senderId) {
            const senderJson = await fetchRedis('get', `user:${senderId}`) as string;
            const sender = JSON.parse(senderJson);
            return {
                id: senderId,
                email: sender.email
            }
        })
    );

    return (
        <section className="flex flex-col p-4">
            <AddFriend />
            <FriendRequests incomingFriendRequests={incomingFriendRequest} sessionId={session.user.id} />
        </section>
    )
}

export default page;
