'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-center">Welcome to Todo App</h1>
        <p className="text-center text-muted-foreground">
          Sign in with your GitHub account to continue
        </p>
        <Button
          className="w-full"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <Github className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}