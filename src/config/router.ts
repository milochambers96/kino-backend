import express from "express";
import { signup, login } from "../controllers/userControllers";
import { getACinema, getAllCinemas } from "../controllers/cinemaControllers";

export const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/cinemas").get(getAllCinemas);

router.route("/cinemas/:cinemaId").get(getACinema);

router.route("/cinemas/:cinemaId/events");

router.route("/cinemas/:cinemaId/events/:events");
