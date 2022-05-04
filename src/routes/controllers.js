import { Router } from 'express'
import { controllers } from '../controllers'
import { isAuthenticated } from '../middlewares'

const router = Router()

router.get('/', isAuthenticated, controllers.getAllControllers)
router.get('/:id', isAuthenticated, controllers.getController)
router.post('/', isAuthenticated, controllers.createController)
router.put('/:id', isAuthenticated, controllers.updateController)
router.delete('/:id', isAuthenticated, controllers.deleteController)

export default router