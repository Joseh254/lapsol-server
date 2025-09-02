import { Router} from 'express';

import { AddProductsController } from '../../Controllers/AddProducts/AddProducts.Controller.js';
import { AddProductMiddleware } from '../../Middlewares/AddProduct/AddProduct.Middleware.js';

const router = Router()
router.post('/',AddProductMiddleware,AddProductsController)

export default router;