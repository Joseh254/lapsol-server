import { Router } from "express";
import { UpdateCustomerController } from "../../Controllers/UpdateCustomer/UpdateCustomer.Controller.js";
const router = Router();
router.patch("/:id", UpdateCustomerController);
export default router;
