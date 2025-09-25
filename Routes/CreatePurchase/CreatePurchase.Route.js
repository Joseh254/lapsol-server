import { Router } from "express";
import { UserAuth } from "../../Auths/User/UserAuth.js";
import { PurchaseProductMiddleware } from "../../Middlewares/PurchaseValidation/PurchaseValidation.Middleware.js";
import { CreatePurchase } from "../../Controllers/CreatePurchase/CreatePurchase.Controller.js";

const router = Router();
router.post("/", UserAuth, PurchaseProductMiddleware, CreatePurchase);

export default router;
