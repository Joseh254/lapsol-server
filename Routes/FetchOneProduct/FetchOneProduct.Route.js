import { Router } from "express";

import { FetchOneProductController } from "../../Controllers/FetchOneProduct/FetchOneProduct.Controller.js";
import { UserAuth } from "../../Auths/User/UserAuth.js";

const router = Router();

router.get("/", UserAuth, FetchOneProductController);

export default router;
