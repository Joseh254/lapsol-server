import { Router } from "express";

import { FetchOneProductController } from "../../Controllers/FetchOneProduct/FetchOneProduct.Controller.js";

const router = Router();

router.get("/:id", FetchOneProductController);

export default router;
