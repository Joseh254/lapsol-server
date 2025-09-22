import { Router } from "express";
import { FetchPayments } from "../../Controllers/FetchPayments/FetchPayments.Controller.js";

const router = Router();
router.get("/", FetchPayments);
export default router;
