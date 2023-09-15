import { AddFriendDialog } from "@/components/addFriendDialog";
import { Activity, MessageCircle } from "lucide-react";

type layoutProps = {
    children: React.ReactNode;
};

function layout({ children }: layoutProps) {
    return (
        <section className="w-full h-screen flex">
            <aside className="flex h-full w-full max-w-xs grow flex-col gap-4 overflow-y-auto border-r border-gray-200 bg-white px-6 pt-6">
                <div className="flex justify-between items-center w-full">
                    <MessageCircle />
                    <AddFriendDialog />
                </div>
                <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-6">
                        <li>Chat 1</li>
                    </ul>
                </nav>

                {children}
            </aside>
        </section>
    );
}

export default layout;
