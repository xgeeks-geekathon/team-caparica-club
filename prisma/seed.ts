import { Role } from "@prisma/client";
import { prisma } from "../src/server/db";

const industryOfExpertise = [
  { id: "it", name: "IT" },
  { id: "chemie", name: "Chemie" },
  { id: "ecommerce", name: "Ecommerce" },
];

const areasOfExpertise = [
  { id: "softwareDevelopment", name: "Software Development" },
  { id: "sales", name: "Sales" },
  { id: "pitching", name: "Pitching" },
];

const topicOfInterets = [
  { id: "businessModel", name: "Business Model" },
  { id: "marketing", name: "Marketing" },
  { id: "sales", name: "Sales" },
];

const languages = ["German", "English", "French", "Spanish", "Portuguese"];

const users = [
  {
    id: "user_2PJT3ukAZ8coRLqpeDQafMT0GUv",
    username: "alice_participant",
    email: "alice@gmail.com",
    role: Role.PARTICIPANT,
    location: "Costa Da Caparica",
  },
  {
    id: "user_2PJVrcC3gtQ5dLyhkxQxYHVoFBF",
    username: "bob_organizer",
    email: "bob@gmail.com",
    role: Role.ORGANIZER,
    location: undefined,
  },
];

async function main() {
  // create industry of expertise
  await Promise.all(
    industryOfExpertise.map(async (expertise) => {
      await prisma.industryOfExpertise.upsert({
        where: { id: expertise.id },
        update: {},
        create: { ...expertise },
      });
    })
  );

  // create areas of expertise
  await Promise.all(
    areasOfExpertise.map(async (area) => {
      await prisma.areaOfExpertise.upsert({
        where: { id: area.id },
        update: {},
        create: { ...area },
      });
    })
  );

  // create topic of interest
  await Promise.all(
    topicOfInterets.map(async (topic) => {
      await prisma.topicOfInterest.upsert({
        where: { id: topic.id },
        update: {},
        create: { ...topic },
      });
    })
  );

  // create users from clerk
  await Promise.all(
    users.map(async (user) => {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: { ...user },
      });
    })
  );

  // create user languages
  await Promise.all(
    languages.map(async (language) => {
      await prisma.language.upsert({
        where: { id: language.toLowerCase() },
        update: {},
        create: { id: language.toLowerCase(), name: language },
      });
    })
  );

  // add industry skills to alice
  const alice = users.filter(
    (user) => user.username === "alice_participant"
  )[0];
  if (!alice) throw Error("Didn't find alice");
  await prisma.user.update({
    where: { id: alice.id },
    data: {
      industryOfExpertises: {
        connect: [{ id: "it" }, { id: "chemie" }],
      },
    },
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
