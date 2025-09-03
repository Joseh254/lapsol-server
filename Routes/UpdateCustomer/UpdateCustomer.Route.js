import { Router } from "express";
import { UpdateCustomerController } from "../../Controllers/UpdateCustomer/UpdateCustomer.Controller.js";
import { UpdateCustomerMiddleware } from "../../Middlewares/UpdateCustomer/UpdateCustomer.Middleware.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";
const router = Router();
router.patch("/:id", UserAuth,UpdateCustomerMiddleware, UpdateCustomerController);
export default router;
