import express from 'express'
import { singleMarketingUpload } from '../middlewares/upload.middleware.js'
import { whatsappController,GetWhatsappNumberController } from '../controllers/whatsapp.controller.js'

const routers = express.Router()

routers.post('/whatsapp', singleMarketingUpload,whatsappController)
// routers.post('/whatsapp',whatsappController)
routers.get('/all-whatsapp',GetWhatsappNumberController)

export default routers