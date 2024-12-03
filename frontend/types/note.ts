export interface Note {
    id: number;
    title: string;
    content: string;
    deadline: string;
    tags: string[];
    priority: 'low' | 'normal' | 'high';
    createdAt: string;
    updatedAt?: string;
    completed: boolean;
  }
  
  export interface NewNote {
    title: string;
    content: string;
    deadline: string;
    tags: string[];
    priority: 'low' | 'normal' | 'high';
  }
  
  