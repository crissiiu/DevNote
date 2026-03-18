export type Tag = {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export type NoteTag = {
    noteId: string;
    tagId: string;
    tag: Tag;
}

export type Note = {
    id: string;
    userId: string;
    title: string;
    content: string;
    isPinned: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    noteTags?: NoteTag[];
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

export type SearchNote = Note & {
  rank: number;
}

export type SearchNotesResponse = {
    success: boolean;
    message: string;
    data: SearchNote[];
};