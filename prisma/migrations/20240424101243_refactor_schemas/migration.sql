/*
  Warnings:

  - Added the required column `voting_events_id` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city_id` to the `voting_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province_id` to the `voting_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidates` ADD COLUMN `voting_events_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `voting_events` ADD COLUMN `city_id` MEDIUMINT UNSIGNED NOT NULL,
    ADD COLUMN `province_id` MEDIUMINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `candidates` ADD CONSTRAINT `candidates_voting_events_id_fkey` FOREIGN KEY (`voting_events_id`) REFERENCES `voting_events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voting_events` ADD CONSTRAINT `voting_events_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voting_events` ADD CONSTRAINT `voting_events_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
