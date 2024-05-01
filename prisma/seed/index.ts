import { City, PrismaClient, Province, User, UserRole } from "@prisma/client";
import { join } from "path";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const citiesCsv = join(process.cwd(), "prisma/seed/data/regencies.csv");
const provincesCsv = join(process.cwd(), "prisma/seed/data/provinces.csv");

const regencies = parse(readFileSync(citiesCsv));
const provinces = parse(readFileSync(provincesCsv));

async function seedCities() {
  let data: City[] = [];

  for (const regency of regencies) {
    data.push({
      id: +regency[0],
      province_id: +regency[1],
      name: regency[2],
    });
  }

  await prisma.city.createMany({
    data: [
      ...data,
      {
        province_id: 99,
        id: 99,
        name: "GLOBAL",
      },
    ],
    skipDuplicates: true,
  });
}

async function seedProvinces() {
  let data: Province[] = [];

  for (const province of provinces) {
    data.push({ id: +province[0], name: province[1] });
  }

  await prisma.province.createMany({
    data: [
      ...data,
      {
        id: 99,
        name: "GLOBAL",
      },
    ],
  });
}

async function seedRootUser() {
  const data: User = {
    city_id: 3205,
    province_id: 32,
    date_of_birth: 0,
    id: "root",
    username: "root",
    full_name: "root",
    password: await bcrypt.hash("root", 10),
    role: UserRole.ADMIN,
    token: "root",
  };

  await prisma.user.create({
    data,
  });
}

async function seedVotingEvents() {
  const time = new Date().getTime() / 1000;

  const presiden = {
    type: "PRESIDEN",
    start_time: time,
    end_time: time + 86400 * 30,
    city_id: 99,
    province_id: 99,
  };

  const wakilPresiden = {
    type: "WAKIL_PRESIDEN",
    start_time: time,
    end_time: time + 86400 * 30,
    city_id: 99,
    province_id: 99,
  };

  const dpr = {
    type: "DPR",
    start_time: time,
    end_time: time + 86400 * 30,
    city_id: 99,
    province_id: 99,
  };

  let dpd: any[] = [];

  for (const province of provinces) {
    dpd.push({
      type: "DPD",
      start_time: time,
      end_time: time + 86400 * 30,
      city_id: 99,
      province_id: +province[0],
    });
  }

  let dprd: any[] = [];

  for (const province of provinces) {
    for (const regency of regencies) {
      dprd.push({
        type: "DPRD",
        start_time: time,
        end_time: time + 86400 * 30,
        city_id: +regency[0],
        province_id: +province[0],
      });
    }
  }

  await prisma.votingEvents.createMany({
    data: [presiden, wakilPresiden, dpr, ...dpd, ...dprd],
  });
}

async function main() {
  await prisma.$transaction(async (_) => {
    await seedProvinces();
    await seedCities();
    await seedRootUser();
    await seedVotingEvents();
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
