-- AlterTable
ALTER TABLE `candidates` MODIFY `type` ENUM('PRESIDEN', 'WAKIL_PRESIDEN', 'DPR', 'DPRD', 'DPD') NOT NULL;

-- AlterTable
ALTER TABLE `voting_events` MODIFY `type` ENUM('PRESIDEN', 'WAKIL_PRESIDEN', 'DPR', 'DPRD', 'DPD') NOT NULL;
