'use client'

import { useState, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Plus, Trash2, Edit, Search, GripVertical, UserCircle, Filter, X, CheckCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from 'date-fns'

// Interfaces
interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  tags?: string[];
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

// Initial data
const teamMembers: TeamMember[] = [
  { id: 'user1', name: 'John Doe', avatar: '/avatar1.png' },
  { id: 'user2', name: 'Jane Smith', avatar: '/avatar2.png' },
  { id: 'user3', name: 'Mike Johnson', avatar: '/avatar3.png' }
];

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', taskIds: ['task1', 'task2'] },
  { id: 'in-progress', title: 'In Progress', taskIds: ['task3'] },
  { id: 'done', title: 'Done', taskIds: ['task4'] }
];

const initialTasks: { [key: string]: Task } = {
  'task1': {
    id: 'task1',
    title: 'Design UI/UX',
    description: 'Create wireframes for new dashboard',
    assignedTo: 'user2',
    status: 'todo',
    priority: 'high',
    deadline: new Date('2024-02-15'),
    tags: ['design', 'frontend']
  },
  'task2': {
    id: 'task2',
    title: 'Backend API',
    description: 'Implement user authentication',
    assignedTo: 'user1',
    status: 'todo',
    priority: 'medium',
    deadline: new Date('2024-02-20'),
    tags: ['backend', 'api']
  },
  'task3': {
    id: 'task3',
    title: 'Frontend Development',
    description: 'Develop React components',
    assignedTo: 'user1',
    status: 'in-progress',
    priority: 'high',
    deadline: new Date('2024-02-25'),
    tags: ['frontend', 'react']
  },
  'task4': {
    id: 'task4',
    title: 'Testing',
    description: 'Write unit tests',
    assignedTo: 'user2',
    status: 'done',
    priority: 'low',
    deadline: new Date('2024-02-10'),
    tags: ['testing', 'qa']
  }
};

export default function TaskManagementBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [tasks, setTasks] = useState<{ [key: string]: Task }>(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const newSourceTaskIds = Array.from(sourceColumn.taskIds);
    newSourceTaskIds.splice(source.index, 1);

    const newDestTaskIds = Array.from(destColumn.taskIds);
    newDestTaskIds.splice(destination.index, 0, draggableId);

    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) return { ...col, taskIds: newSourceTaskIds };
      if (col.id === destination.droppableId) return { ...col, taskIds: newDestTaskIds };
      return col;
    });

    const updatedTasks = {
      ...tasks,
      [draggableId]: {
        ...tasks[draggableId],
        status: destination.droppableId
      }
    };

    setColumns(newColumns);
    setTasks(updatedTasks);
  };

  const addTask = (columnId: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: 'New Task',
      status: columnId,
      priority: 'medium'
    };

    setTasks(prev => ({
      ...prev,
      [newTaskId]: newTask
    }));

    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, taskIds: [...col.taskIds, newTaskId] }
        : col
    ));

    setCurrentTask(newTask);
    setIsTaskModalOpen(true);
  };

  const editTask = (updatedTask: Task) => {
    setTasks(prev => ({
      ...prev,
      [updatedTask.id]: updatedTask
    }));
    setIsTaskModalOpen(false);
  };

  const deleteTask = (taskId: string) => {
    const newTasks = { ...tasks };
    delete newTasks[taskId];

    const newColumns = columns.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(id => id !== taskId)
    }));

    setTasks(newTasks);
    setColumns(newColumns);
    setIsTaskModalOpen(false);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = Object.values(tasks);

    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterPriority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    if (filterAssignee) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === filterAssignee);
    }

    if (filterTags.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        task.tags && filterTags.every(tag => task.tags?.includes(tag))
      );
    }

    return filteredTasks.sort((a, b) =>
      (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0)
    );
  }, [tasks, searchTerm, filterPriority, filterAssignee, filterTags]);

  const TaskEditModal = () => {
    if (!currentTask) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      editTask(currentTask);
    };

    return (
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={currentTask.title}
                onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={currentTask.description || ''}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Assigned To</Label>
              <Select
                value={currentTask.assignedTo}
                onValueChange={(value) => setCurrentTask({ ...currentTask, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={currentTask.priority}
                onValueChange={(value: Task['priority']) => setCurrentTask({ ...currentTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input
                type="date"
                value={currentTask.deadline ? format(currentTask.deadline, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCurrentTask({
                  ...currentTask,
                  deadline: e.target.value ? new Date(e.target.value) : undefined
                })}
              />
            </div>
            <div>
              <Label>Tags</Label>
              <Input
                value={currentTask.tags?.join(', ') || ''}
                onChange={(e) => setCurrentTask({
                  ...currentTask,
                  tags: e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : []
                })}
                placeholder="Enter tags separated by commas"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="destructive"
                onClick={() => deleteTask(currentTask.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Task
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    Object.values(tasks).forEach(task =>
      task.tags?.forEach(tag => tagSet.add(tag))
    );
    return Array.from(tagSet);
  }, [tasks]);

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex space-x-2 items-center">
          <Input
            placeholder="Search tasks"
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterPriority || undefined}
            onValueChange={(value) => setFilterPriority(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterAssignee || undefined}
            onValueChange={(value) => setFilterAssignee(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              {teamMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TaskEditModal />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((column) => (
            <Card key={column.id} className="bg-white shadow-md">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{column.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addTask(column.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <CardContent
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {column.taskIds
                      .map(taskId => tasks[taskId])
                      .filter(task =>
                        filteredAndSortedTasks.some(filteredTask => filteredTask.id === task.id)
                      )
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                p-3 bg-white border rounded-md shadow-sm relative
                                ${task.priority === 'high' ? 'border-red-500' :
                                  task.priority === 'medium' ? 'border-yellow-500' :
                                    'border-green-500'}
                              `}
                            >
                              <div className="absolute top-2 right-2 flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentTask(task);
                                    setIsTaskModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold">{task.title}</h3>
                                  {task.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {task.description}
                                    </p>
                                  )}

                                  <div className="mt-2 flex items-center space-x-2">
                                    {task.tags && task.tags.map(tag => (
                                      <span
                                        key={tag}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end">
                                  {task.assignedTo && (
                                    <div className="flex items-center space-x-1">
                                      <UserCircle className="h-5 w-5 text-blue-500" />
                                      <span className="text-xs text-gray-600">
                                        {teamMembers.find(m => m.id === task.assignedTo)?.name}
                                      </span>
                                    </div>
                                  )}

                                  {task.deadline && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Clock className="h-4 w-4 text-gray-500" />
                                      <span className="text-xs text-gray-600">
                                        {format(task.deadline, 'MMM dd')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

