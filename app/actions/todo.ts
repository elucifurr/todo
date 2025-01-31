'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '../auth';
import { Priority } from '@prisma/client';

type TodoData = {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: Date;
  color?: string;
  position?: number;
  parentId?: string;
};

export async function getTodos() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const todos = await prisma.todo.findMany({
    where: { 
      userId: session.user.id,
      parentId: null // Only fetch top-level todos
    },
    orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    include: {
      subtasks: {
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }]
      }
    }
  });

  return todos;
}

export async function createTodo(data: TodoData & { title: string }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get the highest position for the current level
  const highestPosition = await prisma.todo.findFirst({
    where: {
      userId: session.user.id,
      parentId: data.parentId || null
    },
    orderBy: { position: 'desc' },
    select: { position: true }
  });

  const todo = await prisma.todo.create({
    data: {
      ...data,
      userId: session.user.id,
      position: (highestPosition?.position ?? -1) + 1
    },
    include: {
      subtasks: true
    }
  });

  revalidatePath('/');
  return todo;
}

export async function updateTodo(id: string, data: TodoData) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const todo = await prisma.todo.update({
    where: { id, userId: session.user.id },
    data,
    include: {
      subtasks: true
    }
  });

  revalidatePath('/');
  return todo;
}

export async function deleteTodo(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  await prisma.todo.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath('/');
}

export async function reorderTodos(items: { id: string; position: number }[]) {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Update all positions in a transaction
  await prisma.$transaction(
    items.map((item) =>
      prisma.todo.update({
        where: { id: item.id, userId: session.user.id },
        data: { position: item.position }
      })
    )
  );

  revalidatePath('/');
}