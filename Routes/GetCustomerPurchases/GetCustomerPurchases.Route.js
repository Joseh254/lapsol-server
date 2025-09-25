import { Router } from "express";
import { GetCustomerPurchases } from "../../Controllers/GetCustomerPurchases/GetCustomerPurchases.Controller.js";

const router = Router();

router.get("/:customerId", GetCustomerPurchases);
export default router;
