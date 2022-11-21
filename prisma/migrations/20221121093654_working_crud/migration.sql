/*
  Warnings:

  - You are about to drop the column `parentChapterId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the column `mainVideo` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `order` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_parentChapterId_fkey";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "parentChapterId",
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "coverImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "mainVideo",
ADD COLUMN     "mainVideoId" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "richContent" DROP NOT NULL;

-- CreateTable
CREATE TABLE "MuxVideo" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "MuxVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_mainVideoId_fkey" FOREIGN KEY ("mainVideoId") REFERENCES "MuxVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
