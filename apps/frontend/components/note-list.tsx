import { Note } from "@/lib/types/note";

type NoteListProps = {
    notes: Note[];
    activeNoteId: string | null;
    onSelectNote: (id: string) => void;
}

export function NoteListSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="h-6 w-1/3 rounded-md bg-gray-200"></div>
                            <div className="mt-3 h-4 w-1/4 rounded-md bg-gray-100"></div>
                        </div>
                    </div>
                    <div className="mt-5 space-y-3">
                        <div className="h-4 w-full rounded-md bg-gray-50"></div>
                        <div className="h-4 w-5/6 rounded-md bg-gray-50"></div>
                        <div className="h-4 w-2/3 rounded-md bg-gray-50"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function NoteList({ notes, activeNoteId, onSelectNote }: NoteListProps) {
    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/50 px-6 py-12 text-center shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                    <svg className="h-6 w-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">No notes found</h3>
                <p className="mt-1 text-[13px] text-gray-500">
                    Your collection is currently empty.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {notes.map((note) => (
                <article
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
                        activeNoteId === note.id 
                            ? "border-black bg-white shadow-lg ring-1 ring-black/5" 
                            : "border-gray-100 bg-white hover:border-gray-300"
                    }`}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className={`truncate text-sm font-bold leading-tight ${activeNoteId === note.id ? "text-black" : "text-gray-900"}`}>
                                    {note.title}
                                </h3>
                                {note.isPinned && (
                                    <div className="shrink-0 rounded-full bg-orange-100 p-0.5" title="Pinned">
                                        <svg className="h-3 w-3 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-gray-400">
                                {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className={`line-clamp-2 text-xs leading-relaxed ${activeNoteId === note.id ? "text-gray-600" : "text-gray-500"}`}>
                            {note.content}
                        </p>
                    </div>
                </article>
            ))}
        </div>
    )
}