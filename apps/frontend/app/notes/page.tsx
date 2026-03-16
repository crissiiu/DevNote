"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { getAccessToken, removeAccessToken } from "@/lib/auth/token";
import { ApiErrorResponse } from "@/lib/types/auth";
import { Note, NotesListResponse } from "@/lib/types/note";
import { useRouter } from "next/navigation";
import { CreateNoteForm } from "@/components/create-note-form";
import { NoteList, NoteListSkeleton } from "@/components/note-list";

export default function NotesPage() {
    const router = useRouter();

    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    async function loadNotes() {
        const token = getAccessToken();

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setErrorMessage("");

            const response = await apiFetch<NotesListResponse>("/notes", {
                method: "GET",
                token
            });

            setNotes(response.data);
        } catch (error) {
            const apiError = error as ApiErrorResponse;

            if (apiError?.statusCode === 401) {
                removeAccessToken();
                router.push("/login");
                return;
            }

            if (Array.isArray(apiError?.message)) {
                setErrorMessage(apiError.message.join(", "));
            } else {
                setErrorMessage(apiError?.message || "Unable to load notes. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateNote(input: {
        title: string;
        content: string;
        isPinned: boolean;
    }) {
        const token = getAccessToken();

        if (!token) {
            router.push("/login");
            return;
        }

        const response: any = await apiFetch("/notes", {
            method: "POST",
            token,
            body: JSON.stringify({
                title: input.title,
                content: input.content,
                isPinned: input.isPinned
            }),
        });

        const newNote = response.note ? response.note : response;

        setNotes((prev) => {
            const updated = [newNote, ...prev];
            return updated.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
        });
    }

    function handleLogout() {
        removeAccessToken();
        router.push("/login");
    }

    useEffect(() => {
        loadNotes();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50/50 px-4 py-8 font-sans sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            DevNotes
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Capture your thoughts and tasks effortlessly.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </header>

                {errorMessage ? (
                    <div className="mb-8 flex items-center rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                        <svg className="mr-3 h-5 w-5 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errorMessage}
                    </div>
                ) : null}

                <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr]">
                    <div className="lg:border-r lg:border-gray-200 lg:pr-8">
                        <CreateNoteForm onCreate={handleCreateNote} />
                    </div>

                    <section className="min-w-0">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Your Notes</h2>
                            {!isLoading && notes.length > 0 && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                                </span>
                            )}
                        </div>
                        
                        {isLoading ? (
                            <NoteListSkeleton />
                        ) : (
                            <NoteList notes={notes} />
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}