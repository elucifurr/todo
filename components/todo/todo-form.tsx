'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createTodo } from "@/app/actions/todo";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Priority, Todo } from "@prisma/client";
import { format } from "date-fns";

const PREDEFINED_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
];

interface TodoFormProps {
  onTodoCreated: (todo: Todo) => void;
}

interface SubtaskFormData {
  title: string;
  description?: string;
}

export function TodoForm({ onTodoCreated }: TodoFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PREDEFINED_COLORS[0].value);
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [dueDate, setDueDate] = useState<Date>();
  const [subtasks, setSubtasks] = useState<SubtaskFormData[]>([]);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const todo = await createTodo({
      title: title.trim(),
      description,
      color,
      priority,
      dueDate
    });

    if (todo) {
      // Create subtasks if any
      if (subtasks.length > 0) {
        for (const subtask of subtasks) {
          await createTodo({
            title: subtask.title,
            description: subtask.description,
            parentId: todo.id,
            priority,
            color
          });
        }
      }

      onTodoCreated(todo);
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setColor(PREDEFINED_COLORS[0].value);
    setPriority("NORMAL");
    setDueDate(undefined);
    setSubtasks([]);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { title: "", description: "" }]);
  };

  const updateSubtask = (index: number, field: keyof SubtaskFormData, value: string) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index] = { ...updatedSubtasks[index], [field]: value };
    setSubtasks(updatedSubtasks);
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateTodo} className="space-y-4 py-4">
          <div className="space-y-4">
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
              <label className="text-sm font-medium">Color</label>
              <Select
                value={color}
                onValueChange={setColor}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span>
                        {PREDEFINED_COLORS.find(c => c.value === color)?.name}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_COLORS.map((color) => (
                    <SelectItem
                      key={color.value}
                      value={color.value}
                      className="flex items-center gap-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: color.value }}
                      />
                      <span>{color.name}</span>
                    </SelectItem>
                  ))}                
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {['LOW', 'NORMAL', 'HIGH', 'URGENT'].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Button type="button" variant="outline" size="sm" onClick={addSubtask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subtask
                </Button>
              </div>
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={subtask.title}
                        onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                        placeholder="Subtask title"
                      />
                      <Input
                        value={subtask.description || ''}
                        onChange={(e) => updateSubtask(index, 'description', e.target.value)}
                        placeholder="Subtask description"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubtask(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create Todo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}