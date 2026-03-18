import { NoteRevision } from "@/lib/types/revision";
import { Clock, History } from "lucide-react";
import { cn } from "@/lib/utils";

type NoteRevisionProps = {
    revisions: NoteRevision[];
    activeRevisionId: string | null;
    onSelect: (revision: NoteRevision) => void;
}

export function NoteRevisionList({
    revisions,
    activeRevisionId,
    onSelect
}: NoteRevisionProps) {
    if (!Array.isArray(revisions) || revisions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <History className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">No revision history found</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-1 mb-4">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">History</h2>
            </div>
            
            <div className="grid gap-2 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                {revisions.map((revision) => {
                    const isActive = revision.id === activeRevisionId;

                    return (
                        <button
                            key={revision.id}
                            onClick={() => onSelect(revision)}
                            className={cn(
                                "group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300",
                                isActive 
                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
                                    : "border-border bg-card/50 hover:border-primary/30 hover:bg-muted/50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-bold text-foreground">
                                        {revision.title || "Untitled Revision"}
                                    </div>
                                    <div className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                                        {new Date(revision.createdAt).toLocaleDateString()} at {new Date(revision.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            
                            {isActive && (
                                <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}