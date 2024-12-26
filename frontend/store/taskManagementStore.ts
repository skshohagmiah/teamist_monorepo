// types.ts
export interface Task {
    id: string
    title: string
    description?: string
    assignedTo?: string
    status: string
    priority: 'low' | 'medium' | 'high'
    deadline?: Date
    tags?: string[]
  }
  
  export interface Column {
    id: string
    title: string
    taskIds: string[]
  }
  
  export interface TeamMember {
    id: string
    name: string
    email: string
    avatar?: string
    role?: string
  }
  
  // taskStore.ts
  import { create } from 'zustand'
  import axios from 'axios'
  import { toast } from 'sonner'
  
  const API_URL = 'http://localhost:3001/api'
  
  interface TaskState {
    tasks: { [key: string]: Task }
    columns: Column[]
    teamMembers: TeamMember[]
    isTaskModalOpen: boolean
    isColumnModalOpen: boolean
    isInviteMemberModalOpen: boolean
    currentTask: Task | null
    newColumnTitle: string
    searchTerm: string
    filterPriority: string | null
    filterAssignee: string | null
    filterTags: string[]
    
    // Task Actions
    fetchTasks: () => Promise<void>
    addTask: (columnId: string) => void
    updateTask: (task: Task) => Promise<void>
    deleteTask: (taskId: string) => Promise<void>
    setCurrentTask: (task: Task | null) => void
    
    // Column Actions
    fetchColumns: () => Promise<void>
    addColumn: (title: string) => Promise<void>
    deleteColumn: (columnId: string) => Promise<void>
    updateColumnOrder: (newColumns: Column[]) => Promise<void>
    
    // Modal Actions
    setTaskModalOpen: (isOpen: boolean) => void
    setColumnModalOpen: (isOpen: boolean) => void
    setNewColumnTitle: (title: string) => void
    
    // Filter Actions
    setSearchTerm: (term: string) => void
    setFilterPriority: (priority: string | null) => void
    setFilterAssignee: (assignee: string | null) => void
    setFilterTags: (tags: string[]) => void
    
    // Team Member Actions
    fetchTeamMembers: () => Promise<void>
    addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<void>
  }
  
  export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: {},
    columns: [],
    teamMembers: [],
    isTaskModalOpen: false,
    isColumnModalOpen: false,
    isInviteMemberModalOpen: false,
    currentTask: null,
    newColumnTitle: '',
    searchTerm: '',
    filterPriority: null,
    filterAssignee: null,
    filterTags: [],
  
    // Task Actions
    fetchTasks: async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`)
        set({ tasks: response.data })
      } catch (error) {
        toast.error('Failed to fetch tasks')
      }
    },
  
    addTask: async (columnId: string) => {
      const newTaskId = `task-${Date.now()}`
      const newTask: Task = {
        id: newTaskId,
        title: 'New Task',
        status: columnId,
        priority: 'medium'
      }
  
      try {
        await axios.post(`${API_URL}/tasks`, newTask)
        
        set(state => ({
          tasks: { ...state.tasks, [newTaskId]: newTask },
          columns: state.columns.map(col =>
            col.id === columnId
              ? { ...col, taskIds: [...col.taskIds, newTaskId] }
              : col
          ),
          currentTask: newTask,
          isTaskModalOpen: true
        }))
        
        toast.success('Task added successfully')
      } catch (error) {
        toast.error('Failed to add task')
      }
    },
  
    updateTask: async (updatedTask: Task) => {
      try {
        await axios.put(`${API_URL}/tasks/${updatedTask.id}`, updatedTask)
        
        set(state => ({
          tasks: { ...state.tasks, [updatedTask.id]: updatedTask },
          isTaskModalOpen: false,
          currentTask: null
        }))
        
        toast.success('Task updated successfully')
      } catch (error) {
        toast.error('Failed to update task')
      }
    },
  
    deleteTask: async (taskId: string) => {
      try {
        await axios.delete(`${API_URL}/tasks/${taskId}`)
        
        set(state => {
          const newTasks = { ...state.tasks }
          delete newTasks[taskId]
          
          return {
            tasks: newTasks,
            columns: state.columns.map(col => ({
              ...col,
              taskIds: col.taskIds.filter(id => id !== taskId)
            })),
            isTaskModalOpen: false,
            currentTask: null
          }
        })
        
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    },
  
    setCurrentTask: (task) => set({ currentTask: task }),
  
    // Column Actions
    fetchColumns: async () => {
      try {
        const response = await axios.get(`${API_URL}/columns`)
        set({ columns: response.data })
      } catch (error) {
        toast.error('Failed to fetch columns')
      }
    },
  
    addColumn: async (title: string) => {
      if (!title.trim()) return
      
      const newColumnId = `column-${Date.now()}`
      const newColumn: Column = {
        id: newColumnId,
        title: title,
        taskIds: []
      }
  
      try {
        await axios.post(`${API_URL}/columns`, newColumn)
        
        set(state => ({
          columns: [...state.columns, newColumn],
          newColumnTitle: '',
          isColumnModalOpen: false
        }))
        
        toast.success('Column added successfully')
      } catch (error) {
        toast.error('Failed to add column')
      }
    },
  
    deleteColumn: async (columnId: string) => {
      try {
        await axios.delete(`${API_URL}/columns/${columnId}`)
        
        set(state => {
          const newColumns = state.columns.filter(col => col.id !== columnId)
          const newTasks = { ...state.tasks }
          
          state.columns.find(col => col.id === columnId)?.taskIds.forEach(taskId => {
            delete newTasks[taskId]
          })
          
          return {
            columns: newColumns,
            tasks: newTasks
          }
        })
        
        toast.success('Column deleted successfully')
      } catch (error) {
        toast.error('Failed to delete column')
      }
    },
  
    updateColumnOrder: async (newColumns: Column[]) => {
      try {
        await axios.put(`${API_URL}/columns/order`, { columns: newColumns })
        set({ columns: newColumns })
      } catch (error) {
        toast.error('Failed to update column order')
      }
    },
  
    // Modal Actions
    setTaskModalOpen: (isOpen) => set({ isTaskModalOpen: isOpen }),
    setColumnModalOpen: (isOpen) => set({ isColumnModalOpen: isOpen }),
    setNewColumnTitle: (title) => set({ newColumnTitle: title }),
  
    // Filter Actions
    setSearchTerm: (term) => set({ searchTerm: term }),
    setFilterPriority: (priority) => set({ filterPriority: priority }),
    setFilterAssignee: (assignee) => set({ filterAssignee: assignee }),
    setFilterTags: (tags) => set({ filterTags: tags }),
  
    // Team Member Actions
    fetchTeamMembers: async () => {
      try {
        const response = await axios.get(`${API_URL}/team-members`)
        set({ teamMembers: response.data })
      } catch (error) {
        toast.error('Failed to fetch team members')
      }
    },
  
    addTeamMember: async (member) => {
      try {
        const response = await axios.post(`${API_URL}/team-members`, member)
        set(state => ({
          teamMembers: [...state.teamMembers, response.data],
          isInviteMemberModalOpen: false
        }))
        toast.success('Team member added successfully')
      } catch (error) {
        toast.error('Failed to add team member')
      }
    }
  }))