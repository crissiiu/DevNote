import { Note } from "@/lib/types/note";
import { cn } from "@/lib/utils";
import { Pin, Clock, FileText, SearchX } from "lucide-react";

type NoteListProps = {
    notes: Note[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
}

export function NoteListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-2/3 rounded-lg bg-muted/60"></div>
                                <div className="h-3 w-3 rounded-full bg-muted/40"></div>
                            </div>
                            <div className="h-3 w-1/3 rounded-lg bg-muted/40"></div>
                        </div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <div className="h-2.5 w-full rounded-lg bg-muted/30"></div>
                        <div className="h-2.5 w-5/6 rounded-lg bg-muted/30"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function NoteList({ notes, activeNoteId, onSelectNote }: NoteListProps) {
    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center animate-fade-in">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50 border border-border/50">
                    <SearchX className="h-6 w-6 text-muted-foreground/60" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-black text-foreground/80">Everything's empty</h3>
                <p className="mt-2 text-xs text-muted-foreground max-w-[180px] leading-relaxed">
                    Start by creating your first note or trying a different search.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2 pb-8">
            {notes.map((note) => {
                const isActive = activeNoteId === note.id;
                
                return (
                    <article
                        key={note.id}
                        onClick={() => onSelectNote(note.id)}
                        className={cn(
                            "group relative cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-300 animate-fade-in",
                            isActive 
                                ? "bg-primary/10 shadow-sm" 
                                : "hover:bg-muted/50"
                        )}
                    >
                        {/* Active Indicator */}
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary" />
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-3">
                                <h3 className={cn(
                                    "flex-1 truncate text-sm font-black tracking-tight transition-colors",
                                    isActive ? "text-primary" : "text-foreground group-hover:text-primary/80"
                                )}>
                                    {note.title || "Untitled"}
                                </h3>
                                {note.isPinned && (
                                    <Pin className="h-3 w-3 shrink-0 text-primary rotate-45 mt-1" fill="currentColor" />
                                )}
                            </div>
                            
                            <p className={cn(
                                "line-clamp-2 text-[13px] leading-relaxed transition-colors",
                                isActive ? "text-foreground/80 font-medium" : "text-muted-foreground"
                            )}>
                                {note.content || "No content..."}
                            </p>

                            {note.noteTags && note.noteTags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {note.noteTags.map((nt) => (
                                        <span 
                                            key={nt.tagId}
                                            className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold"
                                        >
                                            #{nt.tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-auto pt-2">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                        <span className="mx-1 opacity-50">•</span>
                                        {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    )
}