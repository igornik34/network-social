/*
  Warnings:

  - You are about to drop the column `dialogLastMessageId` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,lastMessageId]` on the table `Dialog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_dialogLastMessageId_fkey";

-- DropIndex
DROP INDEX "Message_dialogLastMessageId_key";

-- AlterTable
ALTER TABLE "Dialog" ADD COLUMN     "lastMessageId" TEXT;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "dialogLastMessageId";

-- CreateIndex
CREATE UNIQUE INDEX "Dialog_id_lastMessageId_key" ON "Dialog"("id", "lastMessageId");

-- AddForeignKey
ALTER TABLE "Dialog" ADD CONSTRAINT "Dialog_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
