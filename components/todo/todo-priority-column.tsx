'use client';

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TodoItem } from "./todo-item";
import { Badge } from "@/components/ui/badge";
import type { Todo } from "@prisma/client";

interface TodoPriorityColumnProps {
  priority: string;
  todos: Array<Todo & { subtasks: Todo[] }>;
  onReorder: (id: string, newPosition: number) => void;
  onTodoDeleted: (id: string) => void;
}

export function TodoPriorityColumn({ priority, todos, onReorder, onTodoDeleted }: TodoPriorityColumnProps) {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-center">
        <Badge
          variant="outline"
          className={`text-md transition-colors hover:bg-secondary ${priority === 'URGENT' ? 'border-red-500 text-red-500 hover:text-red-600' : 
            priority === 'HIGH' ? 'border-orange-500 text-orange-500 hover:text-orange-600' : 
            priority === 'NORMAL' ? 'border-blue-500 text-blue-500 hover:text-blue-600' : 
            'border-gray-500 text-gray-500 hover:text-gray-600'}`}
        >
          {priority}
        </Badge>
      </div>
      <Droppable droppableId={priority}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-3 min-h-[200px] p-4 rounded-lg bg-secondary/20"
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem
                      {...todo}
                      onReorder={onReorder}
                      onTodoDeleted={onTodoDeleted}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}