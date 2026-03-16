import { Note } from "@/lib/types/note";

type NoteListProps = {
    notes: Note[];
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

export function NoteList({ notes }: NoteListProps) {
    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-16 text-center shadow-sm">
                <svg className="mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">No notes yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first note using the form.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {notes.map((note) => (
                <article
                    key={note.id}
                    className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h3 className="text-lg font-bold leading-tight text-gray-900">
                                    {note.title}
                                </h3>
                                {note.isPinned && (
                                    <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                        </svg>
                                        Pinned
                                    </span>
                                )}
                            </div>
                            <p className="mt-1.5 text-xs font-medium text-gray-400">
                                {new Date(note.updatedAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                            {note.content}
                        </p>
                    </div>
                </article>
            ))}
        </div>
    )
}