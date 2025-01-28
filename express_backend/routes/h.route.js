import { Router } from "express";
import {
  addHospital,
  getAllHospitals,
  addRating,
  addReview,
  editHospital,
  deleteHospital,
  getHospital
} from "../controllers/h.controller.js";

const router = Router();
router.route("/add-hospital").post(addHospital);
router.route("/hospitals").get(getAllHospitals);
router.route("/add-rating").post(addRating);
router.route("/add-review").post(addReview);
router.route("/get-hospital/:hospitalId").get(getHospital);
router.route("/edit-hospital/:hospitalId").post(editHospital);
router.route("/delete-hospital/:hospitalId").post(deleteHospital);
export default router;
