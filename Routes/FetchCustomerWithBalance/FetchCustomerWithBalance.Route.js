import { Router } from "express";
import { FetchCustomerWithBalance } from "../../Controllers/FetchCustomerWithBalance/FetchCustomerWithBalance.Controller.js";

const router = Router();

router.get("/", FetchCustomerWithBalance);

export default router;
