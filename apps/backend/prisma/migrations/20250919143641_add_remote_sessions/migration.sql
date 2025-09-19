-- CreateTable
CREATE TABLE "RemoteSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "RemoteSession_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
