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
  getAnEvent,
  getEventsForACinema,
  postAnEvent,
  updateAnEvent,
} from "../controllers/eventsController";
import secureRoute from "../middleware/secureRoute";
import {
  cinemaUserCheck,
  eventOwnerOrHostCheck,
} from "../middleware/accountStatus";
import {
  deleteAComment,
  getCommentsForEvent,
  postAComment,
  updateAComment,
} from "../controllers/commentController";

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

router
  .route("event/:eventId/comments")
  .get(getCommentsForEvent)
  .post(secureRoute, postAComment);

router.route("event/:evnetId").get(getAnEvent);

router
  .route("event/:eventId/comments")
  .delete(secureRoute, deleteAComment)
  .put(secureRoute, updateAComment);
