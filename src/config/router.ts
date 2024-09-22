import express from "express";
import { signup, login, getCurrentUser } from "../controllers/userControllers";
import {
  getAllCinemas,
  postACinema,
  getACinema,
  removeACinema,
  updateACinema,
} from "../controllers/cinemaControllers";
import {
  deleteAnEvent,
  getEventsForACinema,
  postAnEvent,
  updateAnEvent,
} from "../controllers/eventsController";
import secureRoute from "../middleware/secureRoute";
import {
  cinemaUserCheck,
  eventOwnerOrHostCheck,
} from "../middleware/accountStatus";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/user").get(secureRoute, getCurrentUser);

router
  .route("/cinemas")
  .get(getAllCinemas)
  .post(secureRoute, cinemaUserCheck, postACinema);

router
  .route("/cinemas/:cinemaId")
  .get(getACinema)
  .delete(secureRoute, removeACinema)
  .put(secureRoute, updateACinema);

router
  .route("/cinemas/:cinemaId/events")
  .get(getEventsForACinema)
  .post(secureRoute, postAnEvent);

router
  .route("/cinemas/:cinemaId/events/:eventId")
  .delete(secureRoute, eventOwnerOrHostCheck, deleteAnEvent)
  .put(secureRoute, updateAnEvent);
