import { Router } from "express";
import { FetchPurchaseReturns } from "../../Controllers/FetchPurchaseReturns/FetchPurchaseReturns.Controller.js";

const router = Router();

router.get("/", FetchPurchaseReturns);
export default router;
