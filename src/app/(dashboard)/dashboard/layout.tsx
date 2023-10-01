import ChatSideBar from "@/components/ChatSideBar";
import FriendRequest from "@/components/FriendRequestLink";
import FriendRequests from "@/components/FriendRequests";
import SignOutButton from "@/components/SignOutButton";
import { authOptions } from "@/lib/auth";
import { getFriendsByUserId } from "@/utils/friend";
import { fetchRedis } from "@/utils/redis";
import { Activity, MessageCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

type layoutProps = {
    children: React.ReactNode;
};

async function layout({ children }: layoutProps) {
    const session = await getServerSession(authOptions);
    if (!session) notFound();

    const friends = await getFriendsByUserId(session.user.id);
    const unseenRequestCount = (
        (await fetchRedis(
            "smembers",
            `user:${session.user.id}:incoming_friend_requests`
        )) as User[]
    ).length;

    return (
        <section className="w-full h-screen flex">
            <aside className="flex h-full w-full max-w-xs grow flex-col gap-4 overflow-y-auto border-r border-gray-200 bg-white py-4">
                <div className="flex items-center w-full px-2 gap-2">
                    <MessageCircle />
                    <h2 className="font-bold text-lg">Ping Pal</h2>
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-4">
                        <li>
                            <FriendRequest
                                sessionId={session.user.id}
                                initialUnseenRequestCount={unseenRequestCount}
                            />
                        </li>

                        <li className="px-2 text-xs font-medium text-gray-600">
                            MESSAGES
                        </li>

                        <li>
                            <ChatSideBar
                                friends={friends}
                                userId={session.user.id}
                            />
                        </li>
                        <li className="mt-auto flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className="relative h-8 w-8">
                                    <Image
                                        fill
                                        referrerPolicy="no-referrer"
                                        className="rounded-full"
                                        src={session.user.image || ""}
                                        alt="Profile Picture"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span> {session.user.name} </span>
                                    <span className="text-xs text-zinc-400">
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>
                            <SignOutButton />
                        </li>
                    </ul>
                </nav>
            </aside>
            <section className="w-full h-full">{children}</section>
        </section>
    );
}

export default layout;
