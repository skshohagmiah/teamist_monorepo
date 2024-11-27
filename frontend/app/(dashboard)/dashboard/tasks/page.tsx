// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Dummy data
const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    taskIds: ['task-1', 'task-2', 'task-3'],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: ['task-4', 'task-5'],
  },
  done: {
    id: 'done',
    title: 'Done',
    taskIds: ['task-6', 'task-7'],
  },
}

const initialTasks = {
  'task-1': { id: 'task-1', content: 'Create project proposal' },
  'task-2': { id: 'task-2', content: 'Design user interface mockups' },
  'task-3': { id: 'task-3', content: 'Set up development environment' },
  'task-4': { id: 'task-4', content: 'Implement authentication system' },
  'task-5': { id: 'task-5', content: 'Develop API endpoints' },
  'task-6': { id: 'task-6', content: 'Write unit tests' },
  'task-7': { id: 'task-7', content: 'Perform code review' },
}

export default function TasksPage() {
  const [columns, setColumns] = useState(initialColumns)
  const [tasks, setTasks] = useState(initialTasks)

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = columns[source.droppableId]
    const finish = columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })
    } else {
      const startTaskIds = Array.from(start.taskIds)
      startTaskIds.splice(source.index, 1)
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      }

      const finishTaskIds = Array.from(finish.taskIds)
      finishTaskIds.splice(destination.index, 0, draggableId)
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      }

      setColumns({
        ...columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      })
    }
  }

  const addTask = (columnId) => {
    const newTaskId = `task-${Object.keys(tasks).length + 1}`
    const newTask = {
      id: newTaskId,
      content: 'New task',
    }

    setTasks({
      ...tasks,
      [newTaskId]: newTask,
    })

    setColumns({
      ...columns,
      [columnId]: {
        ...columns[columnId],
        taskIds: [...columns[columnId].taskIds, newTaskId],
      },
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(columns).map((column) => (
            <Card key={column.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {column.title}
                </CardTitle>
                <Button size="sm" variant="ghost" onClick={() => addTask(column.id)}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add task</span>
                </Button>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {column.taskIds.map((taskId, index) => (
                        <Draggable key={taskId} draggableId={taskId} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-muted p-2 rounded-md"
                            >
                              <Input
                                value={tasks[taskId].content}
                                onChange={(e) => {
                                  setTasks({
                                    ...tasks,
                                    [taskId]: {
                                      ...tasks[taskId],
                                      content: e.target.value,
                                    },
                                  })
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

