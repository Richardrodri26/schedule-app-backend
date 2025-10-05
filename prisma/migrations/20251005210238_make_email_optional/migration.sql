/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT,
ADD COLUMN     "name" TEXT;

-- CreateIndex
-- Populate existing rows with a default name to satisfy NOT NULL constraint
UPDATE "User" SET "name" = COALESCE("name", '') WHERE "name" IS NULL;

-- Make name NOT NULL after backfilling
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- Add unique index for email (email is optional)
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
