"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { CheckCircle, UserPlus2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type friendRequestsProps = {
    incomingFriendRequests: IncomingFriendRequest[];
    sessionId: string;
};

function FriendRequests({
    incomingFriendRequests,
    sessionId,
}: friendRequestsProps) {
    const [friendRequests, setFriendRequests] = useState<
        IncomingFriendRequest[]
    >(incomingFriendRequests);
    const router = useRouter();

    useEffect(function() {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

        function friendRequestHandler({ id, email}: IncomingFriendRequest) {
            setFriendRequests([...friendRequests, {id, email}])
        }
        pusherClient.bind('incoming_friend_requests', friendRequestHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
        }
    }, [])

    async function acceptFriend(senderId: string) {
        await axios.post("/api/friend/accept", { id: senderId });
        setFriendRequests(friendRequests.filter((x) => x.id != senderId));
        router.refresh();
    }

    async function rejectFriend(senderId: string) {
        await axios.post("/api/friend/reject", { id: senderId });
        setFriendRequests(friendRequests.filter((x) => x.id != senderId));
        router.refresh();
    }

    return (
        <>
            {friendRequests.length ? (
                <div className="mt-4">
                    <h3 className="font-medium text-lg mb-2">
                        Pending Friend Requests
                    </h3>
                    <ul>
                        {friendRequests.map((friend) => (
                            <li
                                key={friend.id}
                                className="flex gap-4 items-center p-4 border-b"
                            >
                                <UserPlus2 />
                                <span className="font-medium text-sm">
                                    {friend.email}
                                </span>
                                <button
                                    aria-label="Accept friend request"
                                    onClick={() => {
                                        acceptFriend(friend.id);
                                    }}
                                >
                                    <CheckCircle className="w-6 h-6 rounded-full text-green-700" />
                                </button>
                                <button aria-label="Reject friend request">
                                    <XCircle className="w-6 h-6 text-red-500" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </>
    );
}

export default FriendRequests;
