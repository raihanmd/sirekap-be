import { PrismaClient, User, UserRole } from "@prisma/client";
import { join } from "path";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const citiesCsv = join(process.cwd(), "prisma/seed/data/regencies.csv");
const provincesCsv = join(process.cwd(), "prisma/seed/data/provinces.csv");

async function seedRegencies() {
  const regenciesContent = readFileSync(citiesCsv);
  const regencies = parse(regenciesContent);

  for (const regency of regencies) {
    await prisma.city.create({
      data: {
        id: +regency[0],
        province_id: +regency[1],
        name: regency[2],
      },
    });
  }
}

async function seedProvinces() {
  const provincesContent = readFileSync(provincesCsv);
  const provinces = parse(provincesContent, {
    skip_empty_lines: true,
  });

  for (const province of provinces) {
    await prisma.province.create({
      data: {
        id: +province[0],
        name: province[1],
      },
    });
  }
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
    data: data,
  });
}

async function main() {
  await seedProvinces();
  await seedRegencies();
  await seedRootUser();
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
