export interface Note {
    id: string;
    title: string;
    content: string;
    tagId: string;
    updatedAt: Date,
    createdAt: Date,
    order: number; 
    userId: string;
  }