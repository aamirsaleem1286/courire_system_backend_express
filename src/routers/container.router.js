import express from 'express'
import {addContainerController,getallContainersList, getSinglelContainer, updateSinglelContainerStatus,updateSingleContainer, updateBulkContainerStatus, deleteSingleContainer} from "../controllers/container.controller.js";
const router = express.Router() 
router.post('/addContainer', addContainerController)
router.get('/allContainersList', getallContainersList)
router.get('/container/:id', getSinglelContainer) //get container
router.post('/update-container/:id', updateSinglelContainerStatus)
router.post('/updateSingleContainer/:id', updateSingleContainer)
router.post('/updateBulkContainerStatus', updateBulkContainerStatus)

router.delete('/deleteSingleContainer/:id', deleteSingleContainer)
export default router