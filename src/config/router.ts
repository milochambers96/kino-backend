import express from "express";
import { signup, login } from "../controllers/userControllers";
import {
  getAllCinemas,
  postACinema,
  getACinema,
  removeACinema,
  updateACinema,
} from "../controllers/cinemaControllers";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/cinemas").get(getAllCinemas).post(postACinema);

router
  .route("/cinemas/:cinemaId")
  .get(getACinema)
  .delete(removeACinema)
  .put(updateACinema);

router.route("/cinemas/:cinemaId/events");

router.route("/cinemas/:cinemaId/events/:events");
