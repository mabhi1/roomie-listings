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
      phone: "111-111-1111",
      photo: null,
      provider: "password",
      roommateAds: {
        create: {
          title: "Looking for a room 1",
          description: "Looking for a room 1",
          address: {
            city: "jersey city",
            state: "NJ",
          },
          rent: 200,
          moveIn: new Date(),
          showEmail: true,
          showPhone: true,
          propertyType: "house",
          roomRequirements: {
            stay: "long",
            attachedBath: true,
            gender: "male",
            rentType: "monthly",
          },
        },
      },
      roomAds: {
        create: {
          title: "1bhk available",
          description: "1bhk available",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          rent: 200,
          moveIn: new Date(),
          showEmail: true,
          showPhone: true,
          propertyType: "house",
          roomRequirements: {
            stay: "long",
            attachedBath: true,
            gender: "male",
            rentType: "monthly",
          },
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
      phone: "222-222-2222",
      photo: "https://lh3.googleusercontent.com/a/ACg8ocLRBTflwhXlSnkKJpZoQEm_WZ4Lvv6hE03Dwu9Zt5pFtptF=s96-c",
      provider: "google",
      roommateAds: {
        create: {
          title: "Looking for a room 2",
          description: "Looking for a room 2",
          address: {
            city: "jersey city",
            state: "NJ",
          },
          rent: 200,
          moveIn: new Date(),
          showEmail: true,
          showPhone: true,
          propertyType: "house",
          roomRequirements: {
            stay: "long",
            attachedBath: true,
            gender: "male",
            rentType: "monthly",
          },
        },
      },
      roomAds: {
        create: {
          title: "2bhk available",
          description: "2bhk available",
          address: {
            city: "jersey city",
            state: "NJ",
            zip: "07306",
          },
          rent: 200,
          moveIn: new Date(),
          showEmail: true,
          showPhone: true,
          propertyType: "house",
          roomRequirements: {
            stay: "long",
            attachedBath: true,
            gender: "male",
            rentType: "monthly",
          },
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
