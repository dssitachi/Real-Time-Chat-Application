"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Menu, MessageCircle } from "lucide-react";
import SignOutButton from "./SignOutButton";
import ChatSideBar from "./ChatSideBar";
import Image from "next/image";
import FriendRequest from "./FriendRequestLink";
import { Session } from "next-auth";

type MobileLayoutProps = {
    session: Session;
    friends: User[];
    unseenRequestCount: number;
};

function MobileLayout({
    session,
    friends,
    unseenRequestCount,
}: MobileLayoutProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Sheet>
                <nav className="border border-b fixed top-0 inset-x-0">
                    <ul className="flex justify-between items-center p-2">
                        <li className="flex">
                            <MessageCircle />
                            <h2 className="font-bold text-lg">PingPal</h2>
                        </li>
                        <li>
                            <SheetTrigger>
                                <Menu />
                            </SheetTrigger>
                        </li>
                    </ul>
                </nav>

                <SheetContent className="p-0 w-full">
                            <aside className="flex h-full w-full grow flex-col gap-4 overflow-y-auto bg-white py-4">
                                
                                <nav className="flex flex-1 flex-col">
                                    <ul className="flex flex-1 flex-col gap-y-4 pt-8">
                                        <li className="bg-gray-200">
                                            <FriendRequest
                                                sessionId={session.user.id}
                                                initialUnseenRequestCount={
                                                    unseenRequestCount
                                                }
                                            />
                                        </li>

                                        <li className="px-2 text-xs font-medium text-gray-600 py-0">
                                            CHATS
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
                                                        src={
                                                            session.user
                                                                .image || ""
                                                        }
                                                        alt="Profile Picture"
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>
                                                        {" "}
                                                        {session.user.name}{" "}
                                                    </span>
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
                </SheetContent>
            </Sheet>
        </>
    );
}

export default MobileLayout;
