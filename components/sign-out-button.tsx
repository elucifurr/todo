'use client';

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}