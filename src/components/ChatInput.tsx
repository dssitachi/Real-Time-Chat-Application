"use client";

import { SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

type ChatInputProps = {
    chatId: string;
};

function ChatInput({ chatId }: ChatInputProps) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const { toast } = useToast();

    async function sendMessage() {
        if (!input) return;
        setIsLoading(true);

        try {
            await axios.post("/api/message/send", { text: input, chatId });
            setInput("");
        } catch {
            toast({
                title: "",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="px-4 py-2 flex items-center gap-2 bg-gray-200">
            <Input
                id="email"
                type="email"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="ghost" onClick={sendMessage}>
                <SendHorizontal />
            </Button>
        </div>
    );
}

export default ChatInput;
