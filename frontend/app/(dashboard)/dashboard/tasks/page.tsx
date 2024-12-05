'use client'

import React, { useState, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { format } from 'date-fns'
import { Plus, Trash2, Edit, Search, GripVertical, UserCircle, Filter, X, Clock, UserPlus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"

// Interfaces
interface Task {
  id: string
  title: string
  description?: string
  assignedTo?: string
  status: string
  priority: 'low' | 'medium' | 'high'
  deadline?: Date
  tags?: string[]
}

interface Column {
  id: string
  title: string
  taskIds: string[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

// Initial data
const initialTeamMembers: TeamMember[] = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '/avatar1.png', role: 'Developer' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: '/avatar2.png', role: 'Designer' },
  { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/avatar3.png', role: 'Product Manager' }
]

const initialColumns: Column[] = [
  { id: 'todo', title: 'To Do', taskIds: ['task1', 'task2'] },
  { id: 'in-progress', title: 'In Progress', taskIds: ['task3'] },
  { id: 'done', title: 'Done', taskIds: ['task4'] }
]

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
}

export default function TaskManagementBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [tasks, setTasks] = useState<{ [key: string]: Task }>(initialTasks)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState<string | null>(null)
  const [filterAssignee, setFilterAssignee] = useState<string | null>(null)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [newColumnTitle, setNewColumnTitle] = useState('')
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    role: ''
  })

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (type === 'COLUMN') {
      const newColumns = Array.from(columns)
      const [reorderedColumn] = newColumns.splice(source.index, 1)
      newColumns.splice(destination.index, 0, reorderedColumn)

      setColumns(newColumns)
      return
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId)
    const destColumn = columns.find(col => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds
      }

      setColumns(columns.map(col =>
        col.id === newColumn.id ? newColumn : col
      ))
    } else {
      const sourceTaskIds = Array.from(sourceColumn.taskIds)
      sourceTaskIds.splice(source.index, 1)
      const newSourceColumn = {
        ...sourceColumn,
        taskIds: sourceTaskIds
      }

      const destTaskIds = Array.from(destColumn.taskIds)
      destTaskIds.splice(destination.index, 0, draggableId)
      const newDestColumn = {
        ...destColumn,
        taskIds: destTaskIds
      }

      setColumns(columns.map(col =>
        col.id === newSourceColumn.id ? newSourceColumn :
        col.id === newDestColumn.id ? newDestColumn : col
      ))
    }

    setTasks(prevTasks => ({
      ...prevTasks,
      [draggableId]: {
        ...prevTasks[draggableId],
        status: destination.droppableId
      }
    }))
  }

  const addTask = (columnId: string) => {
    const newTaskId = `task-${Date.now()}`
    const newTask: Task = {
      id: newTaskId,
      title: 'New Task',
      status: columnId,
      priority: 'medium'
    }

    setTasks(prev => ({
      ...prev,
      [newTaskId]: newTask
    }))

    setColumns(prev => prev.map(col =>
      col.id === columnId
        ? { ...col, taskIds: [...col.taskIds, newTaskId] }
        : col
    ))

    setCurrentTask(newTask)
    setIsTaskModalOpen(true)
  }

  const editTask = (updatedTask: Task) => {
    setTasks(prev => ({
      ...prev,
      [updatedTask.id]: updatedTask
    }))
    setIsTaskModalOpen(false)
  }

  const deleteTask = (taskId: string) => {
    const newTasks = { ...tasks }
    delete newTasks[taskId]

    const newColumns = columns.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(id => id !== taskId)
    }))

    setTasks(newTasks)
    setColumns(newColumns)
    setIsTaskModalOpen(false)
  }

  const addColumn = () => {
    if (!newColumnTitle.trim()) return

    const newColumnId = `column-${Date.now()}`
    const newColumn: Column = {
      id: newColumnId,
      title: newColumnTitle,
      taskIds: []
    }

    setColumns(prev => [...prev, newColumn])
    setNewColumnTitle('')
    setIsColumnModalOpen(false)
  }

  const deleteColumn = (columnId: string) => {
    const newColumns = columns.filter(col => col.id !== columnId)

    const newTasks = { ...tasks }
    columns.find(col => col.id === columnId)?.taskIds.forEach(taskId => {
      delete newTasks[taskId]
    })

    setColumns(newColumns)
    setTasks(newTasks)
  }

  const inviteMember = () => {
    if (!newMemberData.name.trim() || !newMemberData.email.trim()) return

    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      ...newMemberData,
      avatar: `/avatar-${Math.floor(Math.random() * 3) + 1}.png`
    }

    setTeamMembers(prev => [...prev, newMember])
    setNewMemberData({ name: '', email: '', role: '' })
    setIsInviteMemberModalOpen(false)
  }

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = Object.values(tasks)

    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (filterPriority) {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority)
    }

    if (filterAssignee) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === filterAssignee)
    }

    if (filterTags.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        task.tags && filterTags.every(tag => task.tags?.includes(tag))
      )
    }

    return filteredTasks.sort((a, b) =>
      (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0)
    )
  }, [tasks, searchTerm, filterPriority, filterAssignee, filterTags])

  // Task Edit Modal Component
  const TaskEditModal = () => {
    if (!currentTask) return null

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      editTask(currentTask)
    }

    return (
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={currentTask.title}
                onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentTask.description || ''}
                onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={currentTask.assignedTo || ''}
                onValueChange={(value) => setCurrentTask({ ...currentTask, assignedTo: value })}
              >
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select Assignee" />
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
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={currentTask.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') =>
                  setCurrentTask({ ...currentTask, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={currentTask.deadline ? format(currentTask.deadline, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCurrentTask({ ...currentTask, deadline: new Date(e.target.value) })}
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
    )
  }

  // Add Column Modal Component
  const AddColumnModal = () => (
    <Dialog open={isColumnModalOpen} onOpenChange={setIsColumnModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="columnTitle">Column Title</Label>
            <Input
              id="columnTitle"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="Enter column title"
            />
          </div>
          <DialogFooter>
            <Button onClick={addColumn}>Create Column</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Invite Member Modal Component
  const InviteMemberModal = () => (
    <Dialog open={isInviteMemberModalOpen} onOpenChange={setIsInviteMemberModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="memberName">Name</Label>
            <Input
              id="memberName"
              value={newMemberData.name}
              onChange={(e) => setNewMemberData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter member name"
            />
          </div>
          <div>
            <Label htmlFor="memberEmail">Email</Label>
            <Input
              id="memberEmail"
              value={newMemberData.email}
              onChange={(e) => setNewMemberData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter member email"
              type="email"
            />
          </div>
          <div>
            <Label htmlFor="memberRole">Role</Label>
            <Input
              id="memberRole"
              value={newMemberData.role}
              onChange={(e) => setNewMemberData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Enter member role"
            />
          </div>
          <DialogFooter>
            <Button onClick={inviteMember}>Invite Member</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Team Members and Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex items-center space-x-4">
          {/* Team Members Display */}
          <div className="flex -space-x-2">
            {teamMembers.map((member) => (
              <Avatar key={member.id} className="border-2 border-white">
                <AvatarImage src={member.avatar} alt={member.name}  className='border border-purple-300'/>
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* Invite Member Button */}
          <Button
            variant="outline"
            onClick={() => setIsInviteMemberModalOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Priority Filter */}
          <Select
            value={filterPriority || ''}
            onValueChange={(value) => setFilterPriority(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Priority">
                {filterPriority ? (
                  <div className="flex items-center">
                    <span className="capitalize">
                      {filterPriority} Priority
                    </span>
                    <X
                      className="ml-2 h-4 w-4 text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterPriority(null);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" /> Priority
                  </>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select
            value={filterAssignee || ''}
            onValueChange={(value) => setFilterAssignee(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assignee">
                {filterAssignee ? (
                  <div className="flex items-center">
                    <span>
                      {teamMembers.find(m => m.id === filterAssignee)?.name}
                    </span>
                    <X
                      className="ml-2 h-4 w-4 text-gray-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterAssignee(null);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <UserCircle className="mr-2 h-4 w-4" /> Assignee
                  </>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Add Column Button */}
          <Button
            variant="outline"
            onClick={() => setIsColumnModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Column
          </Button>
        </div>
      </div>

      {/* Drag and Drop Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="board"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-4 gap-4"
            >
              {columns.map((column, columnIndex) => (
                <Draggable
                  key={column.id}
                  draggableId={column.id}
                  index={columnIndex}
                >
                  {(columnProvided) => (
                    <Card
                      ref={columnProvided.innerRef}
                      {...columnProvided.draggableProps}
                      className="bg-gray-100"
                    >
                      <CardHeader {...columnProvided.dragHandleProps} className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center">
                          <GripVertical className="mr-2 text-gray-500" />
                          {column.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addTask(column.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardHeader>

                      <Droppable droppableId={column.id} type="TASK">
                        {(taskProvided) => (
                          <CardContent
                            ref={taskProvided.innerRef}
                            {...taskProvided.droppableProps}
                            className="space-y-2"
                          >
                            {column.taskIds.map((taskId, taskIndex) => {
                              const task = tasks[taskId];
                              if (!task) return null;

                              return (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={taskIndex}
                                >
                                  {(taskProvided) => (
                                    <Card
                                      ref={taskProvided.innerRef}
                                      {...taskProvided.draggableProps}
                                      {...taskProvided.dragHandleProps}
                                      className={`
                                        p-3 border-l-4 
                                        ${task.priority === 'high' ? 'border-red-500' :
                                          task.priority === 'medium' ? 'border-yellow-500' :
                                            'border-green-500'}
                                      `}
                                    >
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h3 className="font-semibold">{task.title}</h3>
                                          {task.description && (
                                            <p className="text-xs text-gray-500 mt-1">
                                              {task.description}
                                            </p>
                                          )}
                                          <div className="flex items-center mt-2 space-x-2">
                                            {task.assignedTo && (
                                              <Avatar className="w-5 h-5">
                                                <AvatarImage
                                                  src={
                                                    teamMembers.find(m => m.id === task.assignedTo)?.avatar
                                                  }
                                                />
                                                <AvatarFallback>
                                                  {teamMembers.find(m => m.id === task.assignedTo)?.name.charAt(0)}
                                                </AvatarFallback>
                                              </Avatar>
                                            )}
                                            {task.deadline && (
                                              <div className="flex items-center text-xs text-gray-500">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {format(task.deadline, 'MMM dd')}
                                              </div>
                                            )}
                                          </div>
                                        </div>
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
                                    </Card>
                                  )}
                                </Draggable>
                              );
                            })}
                            {taskProvided.placeholder}
                          </CardContent>
                        )}
                      </Droppable>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modals */}
      <TaskEditModal />
      <AddColumnModal />
      <InviteMemberModal />
    </div>
  );
}

