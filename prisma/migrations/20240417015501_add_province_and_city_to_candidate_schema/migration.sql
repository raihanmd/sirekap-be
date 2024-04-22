/*
  Warnings:

  - Added the required column `city_id` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province_id` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidates` ADD COLUMN `city_id` MEDIUMINT UNSIGNED NOT NULL,
    ADD COLUMN `province_id` MEDIUMINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `candidates` ADD CONSTRAINT `candidates_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `candidates` ADD CONSTRAINT `candidates_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
