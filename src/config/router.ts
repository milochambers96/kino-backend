import express from "express";
import { signup, login } from "../controllers/userControllers";
import {
  getAllCinemas,
  postACinema,
  getACinema,
  removeACinema,
  updateACinema,
} from "../controllers/cinemaControllers";
import {
  getEventsForACinema,
  postAnEvent,
} from "../controllers/eventsController";
import secureRoute from "../middleware/secureRoute";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/cinemas").get(getAllCinemas).post(secureRoute, postACinema);

router
  .route("/cinemas/:cinemaId")
  .get(getACinema)
  .delete(secureRoute, removeACinema)
  .put(secureRoute, updateACinema);

router
  .route("/cinemas/:cinemaId/events")
  .get(getEventsForACinema)
  .post(postAnEvent);

router.route("/cinemas/:cinemaId/events/:events");
