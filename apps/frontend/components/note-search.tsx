"use client"

import { Search, X, Loader2 } from "lucide-react";

type NoteSearchProps = {
    value: string;
    onChange: (query: string) => void;
    onClear: () => void;
    isSearching: boolean;
}

export function NoteSearch({
    value,
    onChange,
    onClear,
    isSearching
}: NoteSearchProps) {
    return (
        <div className="relative group w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Search className="h-5 w-5" />
                )}
            </div>
            <input 
                type="text"
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search notes..."
                className="w-full h-12 bg-card border-border border rounded-2xl pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
            {value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
                    title="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}