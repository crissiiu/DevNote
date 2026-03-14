-- CreateTable
CREATE TABLE "note_revisions" (
    "id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_revisions_note_id_idx" ON "note_revisions"("note_id");

-- CreateIndex
CREATE INDEX "note_revisions_created_at_idx" ON "note_revisions"("created_at");

-- AddForeignKey
ALTER TABLE "note_revisions" ADD CONSTRAINT "note_revisions_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
