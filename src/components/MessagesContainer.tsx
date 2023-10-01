"use client";

import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { useEffect, useState } from "react";

type MessagesContainerProps = {
    chatId: string;
    chatPartner: User;
    sessionId: string;
    initialMessages: Message[];
};

function MessagesContainer({
    chatId,
    chatPartner,
    sessionId,
    initialMessages,
}: MessagesContainerProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

        function messageHandler(message: Message) {
            setMessages((prev) => [message, ...prev]);
        };

        pusherClient.bind("incoming-message", messageHandler);

        return function cleanUpMessageContainer() {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
            pusherClient.unbind("incoming-message", messageHandler);
        };
    }, [chatId]);

    return (
        <div className="flex-grow overflow-y-scroll">
            <div className="h-full flex flex-col-reverse overflow-y-scroll px-4">
                {messages.map(function (message, index) {
                    const userIsSender =
                        message.senderId == sessionId ? true : false;

                    const hasNextMessageFromSameUser =
                        messages[index - 1]?.senderId ===
                        messages[index].senderId;

                    return (
                        <div
                            key={message.id}
                            className={`flex mb-1 ${
                                userIsSender ? "justify-end" : ""
                            }`}
                        >
                            <span
                                className={cn(
                                    "px-4 py-2 rounded-lg inline-block text-sm",
                                    {
                                        "bg-indigo-600 text-white":
                                            userIsSender,
                                        "bg-gray-200 text-gray-900":
                                            !userIsSender,
                                        "rounded-br-none":
                                            !hasNextMessageFromSameUser &&
                                            userIsSender,
                                        "rounded-bl-none":
                                            !hasNextMessageFromSameUser &&
                                            !userIsSender,
                                    }
                                )}
                            >
                                {message.text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MessagesContainer;
