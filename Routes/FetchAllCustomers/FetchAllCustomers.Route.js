import { Router } from "express";
import { FetchAllCustomersController } from "../../Controllers/FetchAllCustomers/FetchAllCustomers.Controller.js";

const router = Router();

router.get("/", FetchAllCustomersController);

export default router;
