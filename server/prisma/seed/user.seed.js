const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("1205", 10);

  await prisma.user.create({
    data: {
      email: "razzer.howa@gmail.com",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Usuario inicial creado");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
