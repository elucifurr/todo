'use client';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, ChevronDown, ChevronRight, Calendar, Flag, Pencil } from "lucide-react";
import { useState } from "react";
import { updateTodo, deleteTodo } from "@/app/actions/todo";
import type { Priority, Todo } from "@prisma/client";
import { format } from "date-fns";

interface TodoItemProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  color: string;
  subtasks: Todo[];
  position: number;
  onReorder?: (id: string, newPosition: number) => void;
  onTodoDeleted: (id: string) => void;
}

export function TodoItem({
  id,
  title: initialTitle,
  description: initialDescription,
  completed: initialCompleted,
  priority: initialPriority,
  dueDate: initialDueDate,
  color,
  subtasks,
  position,
  onReorder,
  onTodoDeleted
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription || "");
  const [completed, setCompleted] = useState(initialCompleted);
  const [priority, setPriority] = useState(initialPriority);
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDueDate);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subtasksList, setSubtasksList] = useState(subtasks);
  const [todoColor, setTodoColor] = useState(color);

  const handleTitleUpdate = async () => {
    if (title.trim() === initialTitle) {
      setIsEditing(false);
      return;
    }

    await updateTodo(id, { title: title.trim() });
    setIsEditing(false);
  };

  const handleCompletedUpdate = async () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    await updateTodo(id, { completed: newCompleted });
  };

  const handleDescriptionUpdate = async () => {
    await updateTodo(id, { description });
  };

  const handlePriorityUpdate = async (newPriority: Priority) => {
    setPriority(newPriority);
    await updateTodo(id, { priority: newPriority });
  };

  const handleDueDateUpdate = async (date: Date | undefined) => {
    setDueDate(date);
    await updateTodo(id, { dueDate: date });
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTodo(id);
      onTodoDeleted(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSaveChanges = async () => {
    await updateTodo(id, {
      title: title.trim(),
      description,
      priority,
      dueDate
    });
    setIsDialogOpen(false);
  };

  const priorityColors = {
    LOW: "text-gray-500",
    NORMAL: "text-blue-500",
    HIGH: "text-orange-500",
    URGENT: "text-red-500"
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow relative overflow-hidden"
      style={{
        backgroundColor: `${color}08`,
        borderColor: `${color}20`
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-black/5 rounded-full"
            >
              {subtasks.length > 0 && (
                isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </button>

            <Checkbox
              checked={completed}
              onCheckedChange={handleCompletedUpdate}
              className="h-5 w-5"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                  className="flex-1"
                />
              ) : (
                <div
                  onClick={() => setIsEditing(true)}
                  className={`flex-1 cursor-pointer ${completed ? 'line-through text-gray-500' : ''}`}
                >
                  {title}
                </div>
              )}
            </div>
            
            <div className="space-y-1.5 text-sm text-gray-500">
              {description && (
                <div className="flex items-start gap-1">
                  <span className="leading-tight">{description}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {dueDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(dueDate, 'MMM d, yyyy')}</span>
                  </div>
                )}
                <div className={`flex items-center gap-1.5 ${priorityColors[priority]}`}>
                  <Flag className="h-4 w-4" />
                  <span>{priority}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Todo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Todo title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add a description..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="w-full border rounded px-3 py-2"
                    >
                      {Object.keys(priorityColors).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <input
                      type="date"
                      value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Subtasks</label>
                    </div>
                    <div className="space-y-2">
                      {subtasksList.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={async () => {
                              await updateTodo(subtask.id, { completed: !subtask.completed });
                              setSubtasksList(subtasksList.map(st => 
                                st.id === subtask.id ? { ...st, completed: !st.completed } : st
                              ));
                            }}
                          />
                          <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                            {subtask.title}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-auto"
                            onClick={async () => {
                              await deleteTodo(subtask.id);
                              setSubtasksList(subtasksList.filter(st => st.id !== subtask.id));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save changes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isExpanded && subtasks.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="subtasks">
              <AccordionTrigger>Subtasks</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <TodoItem
                      key={subtask.id}
                      {...subtask}
                      subtasks={[]}
                      onReorder={onReorder}
                      onTodoDeleted={onTodoDeleted}
                    />
                  ))}                
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
        {isExpanded && subtasksList.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium">Subtasks</div>
            {subtasksList.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2 ml-4">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={async () => {
                    await updateTodo(subtask.id, { completed: !subtask.completed });
                    setSubtasksList(subtasksList.map(st => 
                      st.id === subtask.id ? { ...st, completed: !st.completed } : st
                    ));
                  }}
                />
                <span className={subtask.completed ? 'line-through text-gray-500' : ''}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}