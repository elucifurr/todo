/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `categoryId` on the `Todo` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Category";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "dueDate" DATETIME,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "color" TEXT NOT NULL DEFAULT '#000000',
    CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Todo_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Todo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Todo" ("completed", "createdAt", "description", "dueDate", "id", "parentId", "position", "priority", "title", "updatedAt", "userId") SELECT "completed", "createdAt", "description", "dueDate", "id", "parentId", "position", "priority", "title", "updatedAt", "userId" FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
