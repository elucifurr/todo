'use client';

import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { TodoForm } from "./todo-form";
import { TodoPriorityColumn } from "./todo-priority-column";
import type { Todo } from "@prisma/client";
import { reorderTodos, updateTodo } from "@/app/actions/todo";

interface TodoListProps {
  initialTodos: Array<Todo & { subtasks: Todo[] }>;
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos);

  const handleTodoDeleted = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleTodoCreated = (todo: Todo) => {
    setTodos([todo, ...todos]);
  };

  const priorityColumns = {
    URGENT: todos.filter(todo => todo.priority === 'URGENT'),
    HIGH: todos.filter(todo => todo.priority === 'HIGH'),
    NORMAL: todos.filter(todo => todo.priority === 'NORMAL'),
    LOW: todos.filter(todo => todo.priority === 'LOW')
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceColumn = result.source.droppableId;
    const destinationColumn = result.destination.droppableId;

    // Get all todos in their current order
    const allTodos = Array.from(todos);
    const [movedTodo] = allTodos.splice(
      allTodos.findIndex(t => t.id === result.draggableId),
      1
    );

    // Update the priority if moved to a different column
    if (sourceColumn !== destinationColumn) {
      movedTodo.priority = destinationColumn as any;
      await updateTodo(movedTodo.id, { priority: destinationColumn as any });
    }

    // Calculate new position
    const columnTodos = allTodos.filter(t => t.priority === destinationColumn);
    columnTodos.splice(result.destination.index, 0, movedTodo);

    // Update positions for the affected column
    const updatedPositions = columnTodos.map((todo, index) => ({
      id: todo.id,
      position: index
    }));

    // Update state and persist changes
    const newTodos = allTodos
      .filter(t => t.priority !== destinationColumn)
      .concat(columnTodos);

    setTodos(newTodos);
    await reorderTodos(updatedPositions);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Todo Creation Form */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <TodoForm onTodoCreated={handleTodoCreated} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(priorityColumns).map(([priority, columnTodos]) => (
              <TodoPriorityColumn
                key={priority}
                priority={priority}
                todos={columnTodos}
                onTodoDeleted={handleTodoDeleted}
                onReorder={(id, newPosition) => {
                  const updatedTodos = todos.map(t =>
                    t.id === id ? { ...t, position: newPosition } : t
                  );
                  setTodos(updatedTodos);
                }}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}