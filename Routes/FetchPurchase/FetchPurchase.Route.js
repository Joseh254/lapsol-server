import { Router } from "express";
import { FetchPurchaseController } from "../../Controllers/FetchPurchase/FetchPurchase.Controller.js";

const router = Router();
router.get("/", FetchPurchaseController);

export default router;
