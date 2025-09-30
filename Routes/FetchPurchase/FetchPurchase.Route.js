import { Router } from "express";
import { FetchPurchaseController } from "../../Controllers/FetchPurchase/FetchPurchase.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();
router.get("/", UserAuth, FetchPurchaseController);

export default router;
