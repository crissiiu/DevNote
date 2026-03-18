export type NoteRevision = {
    id: string;
    noteId: string;
    title: string;
    content: string;
    createdAt: string;
}

export type NoteRevisionResponse = {
    success: boolean;
    message: string;
    data: NoteRevision[];
}