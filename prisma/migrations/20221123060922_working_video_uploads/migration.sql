/*
  Warnings:

  - You are about to drop the column `url` on the `MuxVideo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseId,order]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chapterId,order]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `status` on the `MuxVideo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MuxVideoStatus" AS ENUM ('WAITING', 'READY');

-- AlterTable
ALTER TABLE "MuxVideo" DROP COLUMN "url",
ADD COLUMN     "aspectRatio" TEXT,
ADD COLUMN     "assetId" TEXT,
ADD COLUMN     "duration" DOUBLE PRECISION,
ADD COLUMN     "playbackId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "MuxVideoStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_courseId_order_key" ON "Chapter"("courseId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_chapterId_order_key" ON "Lesson"("chapterId", "order");
