"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { UserPlus2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type friendRequestProps = {
    sessionId: string;
    initialUnseenRequestCount: number;
};

function FriendRequest({
    sessionId,
    initialUnseenRequestCount,
}: friendRequestProps) {
    const [unseenRequestCount, setUnseenRequestCount] = useState(
        initialUnseenRequestCount
    );

    useEffect(function () {
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        );

        function friendRequestHandler() {
            setUnseenRequestCount(unseenRequestCount + 1);
        }
        pusherClient.bind("incoming_friend_requests", friendRequestHandler);

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            );
            pusherClient.unbind(
                "incoming_friend_requests",
                friendRequestHandler
            );
        };
    }, []);

    return (
        <Link
            href="/dashboard/requests"
            className="flex items-center px-2 gap-2"
        >
            <UserPlus2 />
            <span className="text-sm truncate">Friend Requests</span>

            {initialUnseenRequestCount ? (
                <span className="rounded-[8px] font-bold">
                    {initialUnseenRequestCount}
                </span>
            ) : null}
        </Link>
    );
}

export default FriendRequest;
