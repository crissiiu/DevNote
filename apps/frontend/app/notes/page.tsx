"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api/client";
import { getAccessToken, removeAccessToken } from "@/lib/auth/token";
import { ApiErrorResponse } from "@/lib/types/auth";
import { DeleteNoteResponse, Note, NotesListResponse, SearchNotesResponse, UpdateNoteResponse, Tag } from "@/lib/types/note";
import { useRouter } from "next/navigation";
import { CreateNoteForm } from "@/components/create-note-form";
import { NoteList, NoteListSkeleton } from "@/components/note-list";
import { NoteEditor } from "@/components/note-editor";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { NoteSearch } from "@/components/note-search";
import { LogOut, Hash, LayoutGrid, AlertCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoteRevision, NoteRevisionResponse } from "@/lib/types/revision";
import { NoteRevisionList } from "@/components/note-revision-list";
import { NoteRevisionViewer } from "@/components/note-revision-viewer";
import { Sidebar } from "@/components/sidebar";
import { toast } from "sonner";
import { History, X } from "lucide-react";

export default function NotesPage() {
    const router = useRouter();

    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchText, setSearchText] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [revisions, setRevisions] = useState<NoteRevision[]>([]);
    const [activeRevision, setActiveRevision] = useState<NoteRevision | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagId, setActiveTagId] = useState<string | null>(null);


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

            const url = activeTagId 
                ? `/notes?tagId=${activeTagId}` 
                : "/notes";

            const response = await apiFetch<NotesListResponse>(url, {
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

    async function loadTags() {
        const token = getAccessToken();
        if (!token) return;

        try {
            const response = await apiFetch<any>("/tags", {
                method: "GET",
                token
            });
            // Handle different potential response formats
            setTags(response.data || response.tags || response || []);
        } catch (error) {
            console.error("Failed to load tags", error);
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
        
        toast.error(message);
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
        toast.success("Note created successfully");
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
        toast.success("Note saved");
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
        toast.success("Note deleted");
    }

    async function loadRevisions(noteId:string) {
        const token = getAccessToken();

        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setErrorMessage("");

            const response = await apiFetch<any>(
                `/notes/${noteId}/revision`, {
                method: "GET",
                token,
            });

            // Defensive check for double-nesting caused by backend typo (message vs mesage)
            // If response.data is an array, use it directly. 
            // If response.data is an object containing another data array, use that.
            let actualData = [];
            if (Array.isArray(response.data)) {
                actualData = response.data;
            } else if (response.data && Array.isArray(response.data.data)) {
                actualData = response.data.data;
            } else if (response.revision && Array.isArray(response.revision)) {
                actualData = response.revision;
            }

            setRevisions(actualData);
            setActiveRevision(null);
        } catch (error) {
            handleApiError(error);
        }
    }

    async function handleRestoreRevision(revision: NoteRevision) {
        if (!activeNoteId) return;
        
        try {
            await handleSave({
                id: activeNoteId,
                title: revision.title,
                content: revision.content,
                isPinned: activeNote?.isPinned ?? false
            });
            setActiveRevision(null);
            // Refresh revisions as restoring adds a new one usually or changes state
            await loadRevisions(activeNoteId);
            toast.success("Revision restored");
        } catch (error) {
            handleApiError(error);
        }
    }

    async function handleAddTag(noteId: string, tagId: string) {
        const token = getAccessToken();
        if (!token) return;

        try {
            await apiFetch(`/notes/${noteId}/tags/${tagId}`, {
                method: "POST",
                token,
            });
            // Reload the note to get updated tags
            const response = await apiFetch<any>(`/notes/${noteId}`, {
                method: "GET",
                token,
            });
            const updatedNote = response.note || response;
            setNotes(prev => prev.map(n => n.id === noteId ? updatedNote : n));
            toast.success("Tag added");
        } catch (error) {
            handleApiError(error);
        }
    }

    async function handleRemoveTag(noteId: string, tagId: string) {
        const token = getAccessToken();
        if (!token) return;

        try {
            await apiFetch(`/notes/${noteId}/tags/${tagId}`, {
                method: "DELETE",
                token,
            });
            // Update local state
            setNotes(prev => prev.map(n => {
                if (n.id === noteId) {
                    return {
                        ...n,
                        noteTags: n.noteTags?.filter(nt => nt.tagId !== tagId)
                    };
                }
                return n;
            }));
            toast.success("Tag removed");
        } catch (error) {
            handleApiError(error);
        }
    }

    async function handleCreateTag(name: string): Promise<Tag> {
        const token = getAccessToken();
        if (!token) throw new Error("Unauthorized");

        const response = await apiFetch<any>("/tags", {
            method: "POST",
            token,
            body: JSON.stringify({ name })
        });
        
        const newTag = response.data || response.tag || response;
        setTags(prev => [...prev, newTag]);
        toast.success(`Tag "${name}" created`);
        return newTag;
    }

    function handleLogout() {
        removeAccessToken();
        toast.success("Logged out successfully");
        router.push("/login");
    }
    
    function handleClearSearch() {
        setSearchText("");
    }

    useEffect(() => {
        loadNotes();
        loadTags();
    }, []);

    useEffect(() => {
        loadNotes();
    }, [activeTagId]);

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

    useEffect(() => {
        if (activeNoteId) {
            loadRevisions(activeNoteId);
        } else {
            setRevisions([]);
            setActiveRevision(null);
            setShowHistory(false);
        }
    }, [activeNoteId]);

    return (
        <main className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
            <Sidebar 
                onLogout={handleLogout} 
                onCreateNote={() => setIsCreateModalOpen(true)}
                tags={tags}
                activeTagId={activeTagId}
                onSelectTag={setActiveTagId}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 flex overflow-hidden">
                    <section className="flex w-[380px] flex-col border-r border-border bg-card/10 overflow-hidden">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-primary" />
                                    <h2 className="text-sm font-black text-foreground">Notes</h2>
                                </div>
                                {!isLoading && notes.length > 0 && (
                                    <span className="rounded-xl bg-primary/10 px-3 py-1 text-[11px] font-black text-primary border border-primary/10">
                                        {notes.length}
                                    </span>
                                )}
                            </div>
                            
                            <NoteSearch
                                value={searchText}
                                onChange={setSearchText}
                                onClear={handleClearSearch}
                                isSearching={isSearching}
                            />

                            {/* Active Filter Indicator */}
                            {activeTagId && (
                                <div className="flex items-center justify-between px-1 animate-in fade-in slide-in-from-left duration-300">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-bold text-foreground">
                                            #{tags.find(t => t.id === activeTagId)?.name}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setActiveTagId(null)}
                                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
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

                    <section className="flex-1 flex flex-col min-w-0 bg-background/50 relative overflow-hidden">
                        <div className="h-full overflow-y-auto custom-scrollbar p-10">
                            <div className="max-w-4xl mx-auto h-full">
                                {activeRevision ? (
                                    <NoteRevisionViewer 
                                        revision={activeRevision} 
                                        onRestore={handleRestoreRevision}
                                        onClose={() => setActiveRevision(null)}
                                    />
                                ) : (
                                    <NoteEditor 
                                        note={activeNote} 
                                        allTags={tags}
                                        onSave={handleSave} 
                                        onDelete={handleDelete} 
                                        onShowHistory={() => setShowHistory(!showHistory)}
                                        onAddTag={handleAddTag}
                                        onRemoveTag={handleRemoveTag}
                                        onCreateTag={handleCreateTag}
                                    />
                                )}
                            </div>
                        </div>

                        {showHistory && (
                            <div className="absolute top-0 right-0 w-80 h-full border-l border-border bg-card/95 backdrop-blur-xl animate-in slide-in-from-right duration-300">
                                <div className="h-full flex flex-col">
                                    <div className="p-4 border-b border-border flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">History</h3>
                                        <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                                        <NoteRevisionList
                                            revisions={revisions}
                                            activeRevisionId={activeRevision?.id ?? null}
                                            onSelect={setActiveRevision}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <CreateNoteForm 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCreate={handleCreateNote} 
            />
        </main>
    );
}