-- CreateTable
CREATE TABLE "EmergencyRequestContact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emergencyId" INTEGER NOT NULL,
    CONSTRAINT "EmergencyRequestContact_emergencyId_fkey" FOREIGN KEY ("emergencyId") REFERENCES "EmergencyRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
