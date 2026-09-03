-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "schoolName" TEXT NOT NULL,
    "schoolType" TEXT NOT NULL,
    "enrolment" TEXT NOT NULL,
    "region" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME
);
INSERT INTO "new_Assessment" ("completedAt", "createdAt", "email", "enrolment", "fullName", "id", "region", "schoolName", "schoolType", "status", "updatedAt") SELECT "completedAt", "createdAt", "email", "enrolment", "fullName", "id", "region", "schoolName", "schoolType", "status", "updatedAt" FROM "Assessment";
DROP TABLE "Assessment";
ALTER TABLE "new_Assessment" RENAME TO "Assessment";
CREATE INDEX "Assessment_email_idx" ON "Assessment"("email");
CREATE INDEX "Assessment_createdAt_idx" ON "Assessment"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
