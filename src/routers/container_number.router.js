import express from 'express'
import {addContainerNumberController, deleteContainerNumberController, editContainerNumberController, getallContainerNoList} from "../controllers/container_no.controller.js";
const router = express.Router() 
router.post('/addContainerNo', addContainerNumberController)
router.post('/editContainerNo', editContainerNumberController)
router.post('/deleteContainerNo', deleteContainerNumberController)
router.get('/allContainerNoList', getallContainerNoList)

export default router