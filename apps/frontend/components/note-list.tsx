import { Note } from "@/lib/types/note";
import { cn } from "@/lib/utils";
import { Pin, Calendar, FileText, SearchX } from "lucide-react";

type NoteListProps = {
    notes: Note[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
}

export function NoteListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="h-5 w-1/2 rounded-lg bg-muted"></div>
                            <div className="mt-4 h-3 w-1/4 rounded-lg bg-muted opacity-60"></div>
                        </div>
                    </div>
                    <div className="mt-5 space-y-2.5">
                        <div className="h-3 w-full rounded-lg bg-muted opacity-40"></div>
                        <div className="h-3 w-4/5 rounded-lg bg-muted opacity-40"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function NoteList({ notes, activeNoteId, onSelectNote }: NoteListProps) {
    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/40 px-6 py-16 text-center animate-fade-in shadow-sm">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border">
                    <SearchX className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-foreground">No notes found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[200px]">
                    Your collection is currently empty or no results matched.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3 pb-8">
            {notes.map((note) => (
                <article
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={cn(
                        "group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 transform-gpu hover:-translate-y-0.5 animate-fade-in",
                        activeNoteId === note.id 
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/20" 
                            : "border-border bg-card hover:border-primary/40 hover:bg-muted/30 hover:shadow-md"
                    )}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className={cn(
                                    "truncate text-sm font-bold leading-none tracking-tight",
                                    activeNoteId === note.id ? "text-primary" : "text-foreground"
                                )}>
                                    {note.title}
                                </h3>
                                {note.isPinned && (
                                    <Pin className="h-3 w-3 shrink-0 text-primary rotate-45" fill="currentColor" />
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className={cn(
                            "line-clamp-2 text-xs leading-relaxed",
                            activeNoteId === note.id ? "text-foreground/90 font-medium" : "text-muted-foreground"
                        )}>
                            {note.content}
                        </p>
                    </div>
                </article>
            ))}
        </div>
    )
}