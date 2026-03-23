import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';

import 'dotenv/config';

type SeedUser = {
  email: string;
  password: string;
  role: Role;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

function getRequiredProductionEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required when running the seed in production.`);
  }
  return value;
}

function shouldUseEnvironmentSeed(): boolean {
  return [
    process.env.SEED_INITIAL_ADMIN_EMAIL,
    process.env.SEED_INITIAL_ADMIN_PASSWORD,
    process.env.SEED_INITIAL_PROMOTER_EMAIL,
    process.env.SEED_INITIAL_PROMOTER_PASSWORD,
  ].some((value) => value?.trim());
}

function getSeedUsers(): SeedUser[] {
  if (process.env.NODE_ENV === 'production' || shouldUseEnvironmentSeed()) {
    return [
      {
        email: getRequiredProductionEnv('SEED_INITIAL_ADMIN_EMAIL'),
        password: getRequiredProductionEnv('SEED_INITIAL_ADMIN_PASSWORD'),
        role: Role.ADMIN,
      },
      {
        email: getRequiredProductionEnv('SEED_INITIAL_PROMOTER_EMAIL'),
        password: getRequiredProductionEnv('SEED_INITIAL_PROMOTER_PASSWORD'),
        role: Role.PROMOTER,
      },
    ];
  }

  return [
    { email: 'admin@photoopp.com', password: 'admin123', role: Role.ADMIN },
    { email: 'promotor@photoopp.com', password: 'promotor123', role: Role.PROMOTER },
  ];
}

async function ensureUserExists(user: SeedUser): Promise<void> {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  });

  if (existingUser) {
    return;
  }

  const passwordHash = await bcrypt.hash(user.password, 10);

  await prisma.user.create({
    data: {
      email: user.email,
      passwordHash,
      role: user.role,
    },
  });
}

async function main(): Promise<void> {
  const users = getSeedUsers();

  for (const user of users) {
    await ensureUserExists(user);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error: unknown) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

