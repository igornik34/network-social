/*
  Warnings:

  - You are about to drop the column `messageId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sednerId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_messageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sednerId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "messageId",
DROP COLUMN "sednerId",
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
