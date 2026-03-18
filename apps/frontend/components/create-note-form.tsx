"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Pin, Sparkles, Loader2, X } from "lucide-react";

type CreateNoteFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (input: {
        title: string;
        content: string;
        isPinned: boolean;
    }) => Promise<void>;
};

export function CreateNoteForm({ isOpen, onClose, onCreate }: CreateNoteFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim() || !content.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onCreate({
                title: title.trim(),
                content: content.trim(),
                isPinned
            });

            setTitle("");
            setContent("");
            setIsPinned(false);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <form 
                onSubmit={handleSubmit} 
                className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-2xl shadow-primary/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Create New Note</h2>
                        <p className="mt-1 text-sm font-medium text-muted-foreground">Capture your brilliant ideas instantly.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            autoFocus
                            className="w-full h-14 rounded-2xl border border-border bg-muted/50 px-5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/40 font-bold"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Give your note a title..."
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            className="w-full min-h-[200px] resize-none rounded-2xl border border-border bg-muted/50 px-5 py-4 text-sm text-foreground/90 outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/40 leading-relaxed font-medium"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?..."
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={() => setIsPinned(!isPinned)}
                            className={cn(
                                "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all border",
                                isPinned 
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                                    : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                            )}
                        >
                            <Pin className={cn("h-4 w-4", isPinned && "rotate-45")} />
                            {isPinned ? "Pinned" : "Pin this note"}
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 text-xs font-black text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !title.trim() || !content.trim()}
                                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-primary px-8 text-sm font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Plus className="h-5 w-5" />
                                )}
                                {isSubmitting ? "Creating..." : "Create Note"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}