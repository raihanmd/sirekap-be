/*
  Warnings:

  - A unique constraint covering the columns `[province_id,city_id,name,party_id,type]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `candidates_province_id_city_id_name_party_id_type_key` ON `candidates`(`province_id`, `city_id`, `name`, `party_id`, `type`);
