import { Router } from 'express';

import { UserAuth } from '../../Auths/User/UserAuth.js';
import { DeleteCustomerController } from '../../Controllers/DeleteCustomer/DeleteCustomer.Controller.js';
const router = Router()

router.delete('/:id',UserAuth,DeleteCustomerController)

export default router;