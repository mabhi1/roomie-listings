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
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          duration: "permanent",
          budget: 200,
          showEmail: true,
        },
      },
      HouseAds: {
        create: {
          title: "1bhk available",
          description: "1bhk available",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          price: 300,
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
      provider: "google",
      roommateAds: {
        create: {
          title: "Looking for a house 2",
          description: "Looking for a house 2",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          duration: "temporary",
          budget: 400,
          showEmail: true,
        },
      },
      HouseAds: {
        create: {
          title: "2bhk available",
          description: "2bhk available",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          price: 500,
          showEmail: false,
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
