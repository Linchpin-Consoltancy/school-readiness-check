-- CreateTable
CREATE TABLE "DomainScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assessmentId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "lensAScore" REAL NOT NULL,
    "lensBScore" REAL NOT NULL,
    "lensCScore" REAL NOT NULL,
    "score" REAL NOT NULL,
    "tier" TEXT NOT NULL,
    "gapFlag" BOOLEAN NOT NULL DEFAULT false,
    "gapLenses" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DomainScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DomainScore_assessmentId_idx" ON "DomainScore"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainScore_assessmentId_domainId_key" ON "DomainScore"("assessmentId", "domainId");
