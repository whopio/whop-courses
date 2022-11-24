/*
  Warnings:

  - A unique constraint covering the columns `[userId,lessonId]` on the table `UserLessonInteraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserLessonInteraction_userId_lessonId_key" ON "UserLessonInteraction"("userId", "lessonId");
