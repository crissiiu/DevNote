"use client";

import { Note, Tag } from "@/lib/types/note";
import { FormEvent, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Save, Trash2, Pin, Clock, History, ChevronLeft, Hash, X, Plus } from "lucide-react";
import { DeleteConfirmModal } from "./delete-confirm-modal";

type NoteEditProps = {
    note: Note | null;
    allTags: Tag[];
    onSave: (input: {
        id: string;
        title: string;
        content: string;
        isPinned: boolean;
    }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onShowHistory?: () => void;
    onAddTag: (noteId: string, tagId: string) => Promise<void>;
    onRemoveTag: (noteId: string, tagId: string) => Promise<void>;
    onCreateTag: (name: string) => Promise<Tag>;
};

export function NoteEditor({ 
    note, 
    allTags, 
    onSave, 
    onDelete, 
    onShowHistory,
    onAddTag,
    onRemoveTag,
    onCreateTag
}: NoteEditProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            setIsModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!note) {
        return (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/30 p-12 text-center animate-fade-in">
                <div className="mb-6 rounded-3xl bg-muted/50 p-6 border border-border">
                    <Clock className="h-10 w-10 text-muted-foreground/40" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Select a note</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[240px]">
                    Choose a note from the list to start editing or viewing details.
                </p>
            </div>
        );
    }

    const hasChanges = title !== note.title || content !== note.content || isPinned !== note.isPinned;

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col h-full bg-card border border-border rounded-3xl overflow-hidden shadow-sm animate-fade-in">
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Pin className={cn("h-5 w-5", isPinned && "fill-current rotate-45")} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground leading-none">Edit Note</h2>
                            <p className="mt-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                            {new Date(note.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onShowHistory && (
                            <button
                                type="button"
                                onClick={onShowHistory}
                                className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
                                title="View history"
                            >
                                <History className="h-5 w-5" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            disabled={isSubmitting}
                            className="p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            title="Delete note"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                        <input
                            id="edit-title"
                            type="text"
                            className="w-full bg-transparent text-2xl lg:text-3xl font-black text-foreground placeholder:text-muted-foreground outline-none border-none focus:ring-0 p-0"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Untitled Note"
                            maxLength={200}
                            required
                        />

                        {/* Tags Management */}
                        <div className="flex flex-wrap items-center gap-2">
                            {note.noteTags?.map((nt) => (
                                <span 
                                    key={nt.tagId}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold transition-all hover:bg-primary/20"
                                >
                                    <Hash className="h-3 w-3" />
                                    {nt.tag.name}
                                    <button 
                                        type="button" 
                                        onClick={() => onRemoveTag(note.id, nt.tagId)}
                                        className="ml-1 hover:text-destructive transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                            
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-dashed border-border text-muted-foreground text-xs font-bold hover:border-primary/50 hover:text-primary transition-all"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add Tag
                                </button>
                                
                                <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl p-2 hidden group-focus-within:block z-50">
                                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                                        {allTags
                                            .filter(tag => !note.noteTags?.some(nt => nt.tagId === tag.id))
                                            .map(tag => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => onAddTag(note.id, tag.id)}
                                                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold hover:bg-muted transition-colors flex items-center gap-2"
                                                >
                                                    <Hash className="h-3 w-3 opacity-50" />
                                                    {tag.name}
                                                </button>
                                            ))
                                        }
                                        <div className="p-1 pt-2 border-t border-border mt-2">
                                            <input 
                                                className="w-full bg-muted/50 rounded-lg px-2 py-1.5 text-[10px] outline-none focus:ring-1 focus:ring-primary/30"
                                                placeholder="Create new tag..."
                                                onKeyDown={async (e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        const name = (e.target as HTMLInputElement).value.trim();
                                                        if (name) {
                                                            const newTag = await onCreateTag(name);
                                                            await onAddTag(note.id, newTag.id);
                                                            (e.target as HTMLInputElement).value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <textarea
                            id="edit-content"
                            className="flex-1 w-full bg-transparent resize-none text-base lg:text-lg text-foreground/80 placeholder:text-muted-foreground/60 outline-none border-none focus:ring-0 p-0 leading-relaxed min-h-[300px]"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="Start typing your ideas..."
                            required
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-muted/10 flex flex-wrap items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => setIsPinned(!isPinned)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                            isPinned 
                                ? "bg-primary text-primary-foreground border-primary" 
                                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                        )}
                    >
                        <Pin className={cn("h-4 w-4", isPinned && "rotate-45")} />
                        {isPinned ? "Pinned" : "Pin Note"}
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting || !hasChanges}
                        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-40 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>

            <DeleteConfirmModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                isDeleting={isSubmitting}
                title={note.title}
            />
        </>
    );
}