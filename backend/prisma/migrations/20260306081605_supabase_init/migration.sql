-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "storageUrl" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_uniqueCode_key" ON "videos"("uniqueCode");
