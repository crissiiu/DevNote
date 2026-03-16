"use client";

import { FormEvent, useState } from "react";

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
        <form onSubmit={handleSubmit} className="sticky top-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-xl font-bold text-gray-900">Create Note</h2>
            <p className="mb-6 mt-1 text-sm text-gray-500">Jot down something important.</p>

            <div className="space-y-5">
                <div>
                    <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Weekly Meeting Notes"
                        maxLength={200}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="mb-1.5 block text-sm font-semibold text-gray-700">
                        Content
                    </label>
                    <textarea
                        id="content"
                        className="w-full min-h-[160px] resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your thoughts here..."
                        maxLength={200}
                        required
                    />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                    <input
                        type="checkbox"
                        checked={isPinned}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-black"
                        onChange={(e) => setIsPinned(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Pin this note</span>
                </label>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !content.trim()}
                        className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-black"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : "Create Note"}
                    </button>
                </div>
            </div>
        </form>
    );
}