import express from 'express'
import { loginController, register_controller } from '../controllers/auth.controller.js'


const router = express.Router()

router.post('/register', register_controller)
router.post('/login', loginController)

export default router