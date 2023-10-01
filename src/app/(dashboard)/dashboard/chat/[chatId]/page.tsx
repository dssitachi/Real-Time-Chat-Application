import ChatInput from "@/components/ChatInput";
import MessagesContainer from "@/components/MessagesContainer";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/utils/redis";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

type PageProps = {
    params: {
        chatId: string;
    };
};

async function getChatMessages(chatId: string) {
    try {
        const response: string[] = await fetchRedis(
            "zrange",
            `chat:${chatId}:messages`,
            0,
            -1
        );
        const messages = response.map(
            (message) => JSON.parse(message) as Message
        );
        const reversedMessages = messages.reverse();
        return reversedMessages
    } catch (err) {
        notFound();
    }
}

async function page({ params }: PageProps) {
    const { chatId } = params;
    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) notFound();

    const { user } = session;
    const [userId1, userId2] = chatId.split("--");

    if (user.id !== userId1 && user.id !== userId2) {
        notFound();
    }

    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartnerStringified = (await fetchRedis(
        "get",
        `user:${chatPartnerId}`
    )) as string;
    const chatPartner = JSON.parse(chatPartnerStringified) as User;
    const chatMessages = await getChatMessages(chatId);

    return (
        <section className="w-full flex flex-col h-full">
            <div className="flex p-4 items-center gap-2 border-b">
                <div className="relative h-8 w-8">
                    <Image
                        fill
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        src={chatPartner.image || ""}
                        alt="Profile Picture"
                    />
                </div>
                <span> {chatPartner.name} </span>
            </div>

            <MessagesContainer
                chatId={chatId}
                chatPartner={chatPartner}
                sessionId={session.user.id}
                initialMessages={chatMessages}
            />

            <ChatInput chatId={chatId} />
        </section>
    );
}

export default page;
