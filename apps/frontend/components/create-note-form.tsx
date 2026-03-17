"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Pin, Sparkles, Loader2 } from "lucide-react";

type CreateNoteFormProps = {
    onCreate: (input: {
        title: string;
        content: string;
        isPinned: boolean;
    }) => Promise<void>;
};

export function CreateNoteForm({ onCreate }: CreateNoteFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="sticky top-6 rounded-3xl border border-border bg-card p-6 shadow-sm shadow-primary/5 transition-all hover:shadow-md animate-fade-in"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground leading-none">New Note</h2>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">Capture your thoughts.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="title" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="w-full h-12 rounded-2xl border border-border bg-muted/30 px-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/50 font-bold"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Project Idea"
                        maxLength={200}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="content" className="text-[11px] font-black uppercase tracking-wider text-muted-foreground ml-1">
                        Content
                    </label>
                    <textarea
                        id="content"
                        className="w-full min-h-[160px] resize-none rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground/80 outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/50 leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Detail your thoughts here..."
                        required
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setIsPinned(!isPinned)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border w-fit",
                        isPinned 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                    )}
                >
                    <Pin className={cn("h-3.5 w-3.5", isPinned && "rotate-45")} />
                    {isPinned ? "Pinned" : "Pin this"}
                </button>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !content.trim()}
                        className="flex w-full items-center justify-center gap-2 h-14 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 hover:scale-[1.02] active:scale-[0.98]"
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
        </form>
    );
}