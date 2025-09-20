import { Router } from "express";
import { UserAuth } from "../../Auths/User/UserAuth.js";
import { FetchAllProductsController } from "../../Controllers/FetchAllProducts/FetchAllProducts.Controller.js";

const router = Router();

router.get("/", UserAuth, FetchAllProductsController);

export default router;
