import { Router } from "express";
import { ReturnPurchase } from "../../Controllers/ReturnPurchase/ReturnPurchase.Controller.js";
const router = Router();
router.post("/", ReturnPurchase);

export default router;
