import { getTodos } from "@/app/actions/todo";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { SignOutButton } from "@/components/sign-out-button";
import { TodoList } from "@/components/todo/todo-list";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const todos = await getTodos();

  return (
    <main className="container py-8">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center justify-between w-full max-w-2xl">
          <div className="text-left space-y-2">
            <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
            <p className="text-muted-foreground">Manage your todos efficiently</p>
          </div>
          <SignOutButton />
        </div>
        <TodoList initialTodos={todos} />
      </div>
    </main>
  );
}
