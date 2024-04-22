/*
  Warnings:

  - Added the required column `image` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `public_id` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidates` ADD COLUMN `image` VARCHAR(255) NOT NULL,
    ADD COLUMN `public_id` VARCHAR(255) NOT NULL;
