import { Router } from "express";

import { FetchUsersController } from "../../Controllers/FetchUsers/FetchUsers.Controller.js";
import AdminAuth from "../../Auths/Admin/AdminAuth.js";

const router = Router();
router.get("/", AdminAuth, FetchUsersController);

export default router;
