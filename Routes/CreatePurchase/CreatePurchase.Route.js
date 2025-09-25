import { Router } from "express";

import { CreatePurchase } from "../../Controllers/CreatePurchase/CreatePurchase.Controller.js";

const router = Router();
router.post("/", CreatePurchase);

export default router;
