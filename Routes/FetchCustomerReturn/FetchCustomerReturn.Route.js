import { Router } from "express";
import { FetchCustomerReturnController } from "../../Controllers/FetchCustomerReturn/FetchCustomerReturn.Controller.js";
const router = Router();
router.get("/", FetchCustomerReturnController);
export default router;
