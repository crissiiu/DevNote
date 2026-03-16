export type Note = {
    id: string;
    userId: string;
    title: string;
    content: string;
    isPinned: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
};

export type NotesListResponse = {
    success: boolean;
    message: string;
    data: Note[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateNoteRequest = {
    title: string;
    content: string;
    isPinned?: boolean;
    isArchived?: boolean;
};

export type CreateNoteResponse = {
    success: boolean;
    message: string;
    note: Note;
}

export type UpdateNoteRequest = {
  title?: string;
  content?: string;
  isPinned?: boolean;
  isArchived?: boolean;
};

export type UpdateNoteResponse = {
  success: boolean;
  message: string;
  note: Note;
};

export type DeleteNoteResponse = {
  success: boolean;
  message: string;
};