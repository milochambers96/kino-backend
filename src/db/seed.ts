import mongoose from "mongoose";
import Cinema from "../models/cinema";
import User from "../models/user";
import Event from "../models/events";

const kinoAdmin = {
  username: "KinoConnect",
  email: "Kino@Connect.com",
  password: "Cinema1!",
  role: "Cinema",
};

const dbURI = process.env.DB_URI || "mongodb://127.0.0.1:27017/kinoconnection";

async function seed() {
  await mongoose.connect(dbURI);
  console.log("Connected to the Kino DB");
  console.log("Removing any existing data");
  await Cinema.deleteMany();
  await User.deleteMany();
  await Event.deleteMany();

  const seedUser = await User.create(kinoAdmin);
  console.log("The following user was added", seedUser);

  const RioCinema = {
    name: "Rio Cinema",
    bio: "The Rio is a genuine 1930's art deco picture palace in Dalston Hackney. The Rio is run as a non-proift charity, and London's longest operating communicty cinema.",
    address: "107 Kingsland High Street, London, E8 2PB",
    area: "East",
    image:
      "https://indy-systems.imgix.net/kb5npisf4jsfyn9xxf7jfyhv7e61?auto=format",
    website: "https://www.riocinema.org.uk/home",
    yearEst: 1909,
    screens: 2,
    capacity: 430,
    owner: seedUser,
  };

  const seedCinema = await Cinema.create(RioCinema);
  console.log("New cinema added:", seedCinema);

  const RioEvent = {
    title: "Pink Palace",
    location: seedCinema,
    description:
      "Pink Palace is a lo-fi safe space to engage with queer film history.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzQx9sN4751UUSDWZ-QTTL2RvVC8gNrawFEA&s",
    recDate: "Weekly, every thursday.",
    eventLink: "https://www.riocinema.org.uk/pink-palace",
    user: seedUser,
  };

  const seedEvent = await Event.create(RioEvent);

  console.log("New event added:", seedEvent);

  await mongoose.disconnect();
}

seed();
