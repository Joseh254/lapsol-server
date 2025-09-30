import { SendMessageController } from "../../Controllers/SendMessage/SendMessage.Controller.js";

import { Router } from "express";

const router = Router();

router.post("/", SendMessageController);
export default router;
