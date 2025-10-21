import express from 'express'
import { getTrackingController } from '../controllers/tracking.controller.js'

const router = express.Router()

router.get("/tracking/:trackingId",getTrackingController)

export default router