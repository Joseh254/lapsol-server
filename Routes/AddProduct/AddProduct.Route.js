import { Router} from 'express';

import { AddProductsController } from '../../Controllers/AddProducts/AddProducts.Controller.js';

const router = Router()
router.post('/',AddProductsController)

export default router;