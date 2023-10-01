"use client";

import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { toast } from "./ui/use-toast";

function SignOutButton() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleSignOut() {
        setIsLoading(true);
        try {
            await signOut();
        } catch(err) {
            toast({
                title: "Login Error",
                description: "There was a problem signing out",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Button variant="ghost" disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" onClick={handleSignOut} />
            )}
        </Button>
    );
}

export default SignOutButton;
