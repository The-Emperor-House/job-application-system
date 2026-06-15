import { PrismaClient, UserRole, EmploymentType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { emailVerified: true },
    create: {
      email: "admin@example.com",
      passwordHash,
      name: "HR Admin",
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const superAdminPasswordHash = await bcrypt.hash("SuperAdmin123!", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      passwordHash: superAdminPasswordHash,
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  });

  const jobs = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      description: "Build and maintain user-facing features using React and Next.js.",
      requirements: "2+ years experience with React/TypeScript.",
      location: "Bangkok",
      employmentType: EmploymentType.FULL_TIME,
      salaryRange: "30,000 - 50,000 THB",
    },
    {
      title: "Backend Developer",
      department: "Engineering",
      description: "Design and build REST APIs and database schemas.",
      requirements: "Experience with Node.js, SQL databases, and ORMs.",
      location: "Bangkok",
      employmentType: EmploymentType.FULL_TIME,
      salaryRange: "35,000 - 55,000 THB",
    },
    {
      title: "HR Officer",
      department: "Human Resources",
      description: "Manage recruitment process and employee records.",
      requirements: "Bachelor's degree in HR or related field.",
      location: "Bangkok",
      employmentType: EmploymentType.FULL_TIME,
      salaryRange: "20,000 - 30,000 THB",
    },
  ];

  for (const job of jobs) {
    const existing = await prisma.jobPosting.findFirst({ where: { title: job.title } });
    if (!existing) {
      await prisma.jobPosting.create({ data: job });
    }
  }

  console.log("Seed completed. Admin login: admin@example.com / Admin123!");
  console.log("Super admin login: superadmin@example.com / SuperAdmin123!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
