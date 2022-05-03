import { Router } from 'express'
import { users } from '../controllers'
import { isAuthenticated } from '../middlewares'

const router = Router()

router.post('/register', users.registerUser)
router.post('/login', users.loginUser)
router.delete('/', isAuthenticated, users.deleteUser)

export default router