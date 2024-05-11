/*
  Warnings:

  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dialogLastMessageId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dialogLastMessageId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sednerId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropIndex
DROP INDEX "Message_dialogId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "senderId",
DROP COLUMN "userId",
ADD COLUMN     "dialogLastMessageId" TEXT NOT NULL,
ADD COLUMN     "sednerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Message_dialogLastMessageId_key" ON "Message"("dialogLastMessageId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sednerId_fkey" FOREIGN KEY ("sednerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_dialogLastMessageId_fkey" FOREIGN KEY ("dialogLastMessageId") REFERENCES "Dialog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
