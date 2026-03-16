"use client";

import { Note } from "@/lib/types/note";
import { FormEvent, useEffect, useState } from "react";

type NoteEditProps = {
    note: Note | null;
    onSave: (input: {
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
};

export function NoteEditor({ note, onSave, onDelete }: NoteEditProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!note) {
            setTitle("");
            setContent("");
            setIsPinned(false);
            return;
        }

        setTitle(note.title);
        setContent(note.content);
        setIsPinned(note.isPinned);
    }, [note]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(!note) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                id: note.id,
                title: title.trim(),
                content: content.trim(),
                isPinned
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDelete() {
        if(!note) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onDelete(note.id);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!note) {
        return (
            <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
                <div className="mb-4 rounded-full bg-gray-50 p-4">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No Note Selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Select a note from the list to view or edit its contents.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Edit Note</h2>
                    <p className="mt-1 text-xs font-medium text-gray-400">
                        Last created: {new Date(note.createdAt).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        })}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="inline-flex items-center rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
            </div>

            <div className="mt-8 space-y-6">
                <div>
                    <label htmlFor="edit-title" className="mb-2 block text-sm font-semibold text-gray-700">
                        Title
                    </label>
                    <input
                        id="edit-title"
                        type="text"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Note title..."
                        maxLength={200}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="edit-content" className="mb-2 block text-sm font-semibold text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="edit-content"
                        className="min-h-[300px] w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-800 outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Write your note content here..."
                        required
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                        <input
                            type="checkbox"
                            checked={isPinned}
                            className="h-5 w-5 cursor-pointer rounded border-gray-300 text-black focus:ring-black"
                            onChange={(event) => setIsPinned(event.target.checked)}
                        />
                        <span className="text-sm font-semibold text-gray-700">Keep this note pinned</span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting || (title === note.title && content === note.content && isPinned === note.isPinned)}
                        className="inline-flex min-w-[140px] items-center justify-center rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : "Save Changes"}
                    </button>
                </div>
            </div>
        </form>
    );
}