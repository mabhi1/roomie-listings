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
      photo: null,
      provider: "password",
      roommateAds: {
        create: {
          title: "Looking for a house 1",
          description: "Looking for a house 1",
          address: {
            city: "jersey city",
            state: "NJ",
          },
          duration: "permanent",
          budget: 200,
          moveIn: new Date(),
          showEmail: true,
        },
      },
      houseAds: {
        create: {
          title: "1bhk available",
          description: "1bhk available",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          price: 300,
          available: new Date(),
          showEmail: false,
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
      photo: "https://lh3.googleusercontent.com/a/ACg8ocLRBTflwhXlSnkKJpZoQEm_WZ4Lvv6hE03Dwu9Zt5pFtptF=s96-c",
      provider: "google",
      roommateAds: {
        create: {
          title: "Looking for a house 2",
          description: "Looking for a house 2",
          address: {
            city: "jersey city",
            state: "NJ",
          },
          duration: "temporary",
          budget: 400,
          moveIn: new Date(),
          showEmail: true,
        },
      },
      houseAds: {
        create: {
          title: "2bhk available",
          description: "2bhk available",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          price: 500,
          available: new Date(),
          showEmail: false,
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
