/*
  Warnings:

  - You are about to drop the column `candidate_type` on the `voting_events` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `voting_events` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Enum(EnumId(2))`.

*/
-- DropIndex
DROP INDEX `candidates_type_fkey` ON `candidates`;

-- DropIndex
DROP INDEX `voting_events_type_fkey` ON `voting_events`;

-- AlterTable
ALTER TABLE `voting_events` DROP COLUMN `candidate_type`,
    MODIFY `type` ENUM('PRESIDEN', 'WAKIL_PRESIDEN', 'DPR', 'DPD') NOT NULL;
