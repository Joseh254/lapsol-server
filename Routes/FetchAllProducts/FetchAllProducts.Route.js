import { Router } from "express";
import { FetchAllProductsController } from "../../Controllers/FetchAllProducts/FetchAllProducts.Controller.js";

const router = Router();

router.get("/", FetchAllProductsController);

export default router;
