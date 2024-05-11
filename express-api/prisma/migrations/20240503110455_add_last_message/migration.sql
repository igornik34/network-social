/*
  Warnings:

  - A unique constraint covering the columns `[dialogId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "messageId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_dialogId_key" ON "Message"("dialogId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Dialog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
