"use client";

import { NoteRevision } from "@/lib/types/revision";
import { ArrowLeft, Clock, RotateCcw } from "lucide-react";

type Props = {
    revision: NoteRevision | null;
    onRestore: (revision: NoteRevision) => void;
    onClose: () => void;
};

export function NoteRevisionViewer({ revision, onRestore, onClose }: Props) {
    if (!revision) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center opacity-60">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-bold text-foreground">View Revision</h3>
                <p className="mt-1 text-xs text-muted-foreground">Select a history item to preview its content</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft className="h-3 w-3" />
                    Back to current version
                </button>

                <button
                    onClick={() => onRestore(revision)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    <RotateCcw className="h-3 w-3" />
                    Restore this version
                </button>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-4xl border border-border bg-card shadow-sm">
                <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5">
                    <RotateCcw className="h-24 w-24" />
                </div>
                
                <div className="h-full overflow-y-auto custom-scrollbar p-8">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary border border-primary/20">
                                Revision Preview
                            </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-foreground">{revision.title || "Untitled"}</h3>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                             Saved on {new Date(revision.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                            {revision.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}