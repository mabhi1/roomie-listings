import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const hello = await prisma.user.upsert({
    where: { uid: "HFXg1nIG3zMZgiDQiNeAcrreHat2" },
    update: {},
    create: {
      uid: "HFXg1nIG3zMZgiDQiNeAcrreHat2",
      name: "Hello",
      email: "hello@hello.com",
      provider: "password",
      roommateAds: {
        create: {
          title: "Looking for a house 1",
          description: "Looking for a house 1",
          address: "address 1",
          budget: 200,
        },
      },
      HouseAds: {
        create: {
          title: "1bhk available",
          description: "1bhk available",
          address: "address 1bhk",
          price: 300,
        },
      },
    },
  });
  const abhishek_mishra = await prisma.user.upsert({
    where: { uid: "83on8wvMh6Z7I1koNp4jDBomvVt1" },
    update: {},
    create: {
      uid: "83on8wvMh6Z7I1koNp4jDBomvVt1",
      name: "Abhishek Mishra",
      email: "mishraabhishek226@gmail.com",
      provider: "google",
      roommateAds: {
        create: {
          title: "Looking for a house 2",
          description: "Looking for a house 2",
          address: "address 2",
          budget: 400,
        },
      },
      HouseAds: {
        create: {
          title: "2bhk available",
          description: "2bhk available",
          address: "address 2bhk",
          price: 500,
        },
      },
    },
  });
  console.log({ hello, abhishek_mishra });
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
