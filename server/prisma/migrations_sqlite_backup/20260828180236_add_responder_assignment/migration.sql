-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmergencyRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "aiService" TEXT,
    "aiSummary" TEXT,
    "aiUrgency" TEXT,
    "aiImportantDetails" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "assignedResponderId" INTEGER,
    "responderLatitude" REAL,
    "responderLongitude" REAL,
    "responderLocationUpdatedAt" DATETIME,
    "responderAssignedAt" DATETIME,
    "responderAcceptedAt" DATETIME,
    "responderArrivedAt" DATETIME,
    CONSTRAINT "EmergencyRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmergencyRequest_assignedResponderId_fkey" FOREIGN KEY ("assignedResponderId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_EmergencyRequest" ("aiImportantDetails", "aiService", "aiSummary", "aiUrgency", "createdAt", "description", "id", "latitude", "longitude", "status", "type", "updatedAt", "userId") SELECT "aiImportantDetails", "aiService", "aiSummary", "aiUrgency", "createdAt", "description", "id", "latitude", "longitude", "status", "type", "updatedAt", "userId" FROM "EmergencyRequest";
DROP TABLE "EmergencyRequest";
ALTER TABLE "new_EmergencyRequest" RENAME TO "EmergencyRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
