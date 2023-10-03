"use client";

import { chatHrefConstructor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ChatSideBarProps = {
    friends: User[];
    userId: string;
};
function ChatSideBar({ friends, userId }: ChatSideBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (pathname?.includes("chat")) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId));
            });
        }
    }, []);

    return (
        <>
            <span className="px-2 text-xs font-medium text-gray-600 py-0">
                CHATS
            </span>
            <ul>
                {friends.map(function (friend) {
                    const unseenMessagesCount = unseenMessages.filter(
                        (unseenMsg) => unseenMsg.senderId == friend.id
                    ).length;
                    return (
                        <li
                            key={friend.id}
                            className="p-2 text-sm border-t flex gap-2 items-center hover:bg-gray-100 hover:cursor-pointer"
                        >
                            <div className="relative h-8 w-8">
                                <Image
                                    fill
                                    referrerPolicy="no-referrer"
                                    className="rounded-full"
                                    src={friend.image || ""}
                                    alt="Profile Picture"
                                />
                            </div>
                            <Link
                                href={`/dashboard/chat/${chatHrefConstructor(
                                    userId,
                                    friend.id
                                )}`}
                            >
                                {friend.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export default ChatSideBar;
