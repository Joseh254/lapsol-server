import { Router } from 'express';

import { CreateSale } from '../../Controllers/CreateSale/CreateSale.Controller.js';
import { UserAuth } from '../../Auths/User/UserAuth.js';

const router = Router()

router.post('/',UserAuth,CreateSale)

export default router;