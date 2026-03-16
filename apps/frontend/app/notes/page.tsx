"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { getAccessToken, removeAccessToken } from "@/lib/auth/token";
import { ApiErrorResponse } from "@/lib/types/auth";
import { DeleteNoteResponse, Note, NotesListResponse, UpdateNoteResponse } from "@/lib/types/note";
import { useRouter } from "next/navigation";
import { CreateNoteForm } from "@/components/create-note-form";
import { NoteList, NoteListSkeleton } from "@/components/note-list";
import { NoteEditor } from "@/components/note-editor";

export default function NotesPage() {
    const router = useRouter();

    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const activeNote = notes.find((note) => note.id === activeNoteId) ?? null;

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
            
            // Auto-select first note if available
            if (response.data.length > 0 && !activeNoteId) {
                setActiveNoteId(response.data[0].id);
            }
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
        
        setActiveNoteId(newNote.id);
    }

    async function handleSave(input: {
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }) {
        const token = getAccessToken();

        if (!token) {
            router.push("/login");
            return;
        }

        const response = await apiFetch<UpdateNoteResponse>(`/notes/${input.id}`, {
            method: "PATCH",
            token,
            body: JSON.stringify({
                title: input.title,
                content: input.content,
                isPinned: input.isPinned,
            }),
        });

        setNotes((prev) => {
            const updated = prev.map((note) => (note.id === input.id ? response.note : note));
            return updated.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            });
        });
    }

    async function handleDelete(id: string) {
        const token = getAccessToken();

        if (!token) {
            router.push("/login");
            return;
        }

        await apiFetch<DeleteNoteResponse>(`/notes/${id}`, {
            method: "DELETE",
            token,
        });

        setNotes((prev) => {
            const updated = prev.filter((note) => note.id !== id);

            if (activeNoteId === id) {
                setActiveNoteId(updated[0]?.id ?? null);
            }

            return updated;
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
        <main className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans overflow-x-hidden">
            <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
                <header className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
                            DevNotes<span className="text-gray-300">.</span>
                        </h1>
                        <p className="mt-1 text-sm font-medium text-gray-400">
                            Your personal space for brilliant ideas.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="group inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-100"
                    >
                        <svg className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </header>

                {errorMessage ? (
                    <div className="mb-8 flex items-center rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                        <svg className="mr-3 h-5 w-5 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errorMessage}
                    </div>
                ) : null}

                <div className="grid h-[calc(100vh-180px)] min-h-[600px] items-start gap-8 overflow-hidden lg:grid-cols-[340px_380px_1fr]">
                    {/* Column 1: Creation Form */}
                    <aside className="h-full overflow-y-auto pr-2 custom-scrollbar">
                        <CreateNoteForm onCreate={handleCreateNote} />
                    </aside>

                    {/* Column 2: List of Notes */}
                    <section className="flex h-full flex-col min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/30 p-4">
                        <div className="mb-4 flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-black">Notes</h2>
                            {!isLoading && notes.length > 0 && (
                                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-gray-400 shadow-sm border border-gray-100">
                                    {notes.length} Total
                                </span>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
                            {isLoading ? (
                                <NoteListSkeleton />
                            ) : (
                                <NoteList 
                                    notes={notes} 
                                    activeNoteId={activeNoteId} 
                                    onSelectNote={setActiveNoteId} 
                                />
                            )}
                        </div>
                    </section>

                    {/* Column 3: Editor */}
                    <section className="h-full overflow-y-auto custom-scrollbar lg:pl-2">
                        <NoteEditor 
                            note={activeNote} 
                            onSave={handleSave} 
                            onDelete={handleDelete} 
                        />
                    </section>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E5E5;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D1D1;
                }
            `}</style>
        </main>
    );
}