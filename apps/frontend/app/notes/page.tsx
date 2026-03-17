"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { getAccessToken, removeAccessToken } from "@/lib/auth/token";
import { ApiErrorResponse } from "@/lib/types/auth";
import { DeleteNoteResponse, Note, NotesListResponse, SearchNotesResponse, UpdateNoteResponse } from "@/lib/types/note";
import { useRouter } from "next/navigation";
import { CreateNoteForm } from "@/components/create-note-form";
import { NoteList, NoteListSkeleton } from "@/components/note-list";
import { NoteEditor } from "@/components/note-editor";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { NoteSearch } from "@/components/note-search";
import { LogOut, Hash, LayoutGrid, AlertCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotesPage() {
    const router = useRouter();

    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchText = useDebounce(searchText, 400);

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
            
            if (response.data.length > 0 && !activeNoteId) {
                setActiveNoteId(response.data[0].id);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function searchNotes(keyword: string) {
        const token = getAccessToken();

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setErrorMessage("");
            setIsSearching(true);

            const response = await apiFetch<SearchNotesResponse>(
                `/notes/search?q=${encodeURIComponent(keyword)}`,
                {
                    method: "GET",
                    token,
                },
            );

            setNotes(response.data);

            if (response.data.length > 0) {
                setActiveNoteId((current) => {
                    const stillExists = response.data.some((note) => note.id === current);
                    return stillExists ? current : response.data[0].id;
                });
            } else {
                setActiveNoteId(null);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSearching(false);
        }
    }
  
    function handleApiError(error: unknown) {
        const apiError = error as ApiErrorResponse;

        if (apiError?.statusCode === 401) {
            removeAccessToken();
            router.push("/login");
            return;
        }

        const message = Array.isArray(apiError?.message) 
            ? apiError.message.join(", ") 
            : (apiError?.message || "Something went wrong. Please try again.");
        
        setErrorMessage(message);
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

        if(debouncedSearchText.trim()) {
            await searchNotes(debouncedSearchText);
            return;
        }

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

        if(debouncedSearchText.trim()) {
            await searchNotes(debouncedSearchText);
            return;
        }

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

        if (debouncedSearchText.trim()) {
            await searchNotes(debouncedSearchText.trim());
            return;
        }

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
    
    function handleClearSearch() {
        setSearchText("");
    }

    useEffect(() => {
        loadNotes();
    }, []);

    useEffect(() => {
        if(isLoading) {
            return;
        }

        const keywords = debouncedSearchText.trim();
        
        if(!keywords){
            loadNotes();
            return;
        }

        searchNotes(keywords);
    }, [debouncedSearchText]);

    return (
        <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            <div className="mx-auto max-w-[1600px] px-6 py-8">
                <header className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                            <Bookmark className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight lg:text-4xl text-foreground">
                                DevNote<span className="text-primary">.</span>
                            </h1>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">
                                Your second brain for brilliant ideas.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="group flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 text-sm font-bold text-foreground transition-all hover:bg-muted hover:border-primary/20"
                        >
                            <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive group-hover:translate-x-0.5 transition-all" />
                            Sign Out
                        </button>
                    </div>
                </header>

                {errorMessage && (
                    <div className="mb-8 flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm font-semibold text-destructive animate-fade-in shadow-sm">
                        <AlertCircle className="h-5 w-5 shrink-0 opacity-80" />
                        {errorMessage}
                    </div>
                )}

                <div className="grid h-[calc(100vh-220px)] min-h-[600px] items-start gap-8 lg:grid-cols-[340px_400px_1fr]">
                    <aside className="h-full flex flex-col space-y-6 overflow-hidden">
                        <div className="flex items-center gap-2 px-1">
                            <LayoutGrid className="h-4 w-4 text-primary" />
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Workspace</h2>
                        </div>
                        <div className="overflow-y-auto pr-2 custom-scrollbar pb-4">
                            <CreateNoteForm onCreate={handleCreateNote} />
                        </div>
                    </aside>

                    <section className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card/40 p-2 shadow-sm">
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-primary" />
                                    <h2 className="text-sm font-black text-foreground">Notes</h2>
                                </div>
                                {!isLoading && notes.length > 0 && (
                                    <span className="rounded-xl bg-primary/10 px-3 py-1 text-[11px] font-black text-primary border border-primary/10">
                                        {notes.length} Total
                                    </span>
                                )}
                            </div>
                            <NoteSearch
                                value={searchText}
                                onChange={setSearchText}
                                onClear={handleClearSearch}
                                isSearching={isSearching}
                            />
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-2">
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

                    <section className="h-full flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2 px-1 mb-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Editor</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <NoteEditor 
                                note={activeNote} 
                                onSave={handleSave} 
                                onDelete={handleDelete} 
                            />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}