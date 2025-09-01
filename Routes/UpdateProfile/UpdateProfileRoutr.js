import { Router } from "express";

import { UpdateProfileController } from "../../Controllers/UpdateProfile/UpdateProfile.Controller.js";

const router = Router();

router.patch("/", UpdateProfileController);

export default router;
