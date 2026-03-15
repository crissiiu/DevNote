export default function NotesPage() {
    return (
        <main className="min-h-screen p-6">
            <h1 className="text-2xl font-bold">Dev Notes</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome to your personal note-taking app.</p>

            <div className="mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + New Note
                </button>
            </div>
        </main>
    )
}