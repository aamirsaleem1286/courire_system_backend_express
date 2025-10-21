import express from 'express'
import { BranchController,CityController, GetAllBranchController, GetAllCityController,EditAllBranchController,DeleteAllBranchController,EditAllCityController,DeleteAllCityController } from '../controllers/country.controller.js'


const router = express.Router();

router.post('/addBranch', BranchController)
router.get('/allBranch', GetAllBranchController)
router.post('/editBranch/:id', EditAllBranchController)
router.delete('/deleteBranch/:id', DeleteAllBranchController)

router.post('/addCity', CityController)
router.get('/allCity', GetAllCityController)
router.post('/editCity/:id', EditAllCityController)
router.delete('/deleteCity/:id', DeleteAllCityController)

export default router