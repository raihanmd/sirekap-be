/*
  Warnings:

  - You are about to alter the column `type` on the `candidates` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(2))`.
  - You are about to drop the `candidates_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `candidate_type` to the `voting_events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `candidates` DROP FOREIGN KEY `candidates_type_fkey`;

-- DropForeignKey
ALTER TABLE `voting_events` DROP FOREIGN KEY `voting_events_type_fkey`;

-- AlterTable
ALTER TABLE `candidates` MODIFY `type` ENUM('PRESIDEN', 'WAKIL_PRESIDEN', 'DPR', 'DPD') NOT NULL;

-- AlterTable
ALTER TABLE `voting_events` ADD COLUMN `candidate_type` ENUM('PRESIDEN', 'WAKIL_PRESIDEN', 'DPR', 'DPD') NOT NULL;

-- DropTable
DROP TABLE `candidates_type`;
