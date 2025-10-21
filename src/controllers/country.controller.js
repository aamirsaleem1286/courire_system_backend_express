import { sendResponse } from '../helpers/sendResponse.js'
import BranchModel from '../models/branch.model.js'
import CityModel from '../models/city.model.js'
const BranchController = async (req, res) => {
    try {
        const { branch } = req.body
        const findBranch = await BranchModel.findOne({ branch })
        if (findBranch) {
             return sendResponse(res,409,true,{branchErr:"Branch already  added"},null)
        }

        const newBranch = new BranchModel({ branch })
        await newBranch.save()

        return sendResponse(res, 200, false, {}, {message:"Branch added Succesfully"})
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
const CityController = async (req, res) => {
    try {
        const { city } = req.body
        const findCity = await CityModel.findOne({ city })
        if (findCity) {
             return sendResponse(res,409,true,{city:"City already  added"},null)
        }

        const newCity = new CityModel({ city })
        await newCity.save()

        return sendResponse(res, 200, false, {}, {message:"City added Succesfully"})
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}

const GetAllBranchController = async (req,res) => {
    try {
        const allBranches = await BranchModel.find()
        

        
        return sendResponse(res, 200, false, {}, {allBranches,message:"Branch get Succesfully"})
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
const GetAllCityController = async (req,res) => {
    try {
        const allCities = await CityModel.find()
        
    
        
        return sendResponse(res, 200, false, {}, {allCities,message:"City get Succesfully"})
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}

const EditAllBranchController = async (req, res) => {
  try {
    const { id } = req.params;
    const { branch } = req.body;

    // Extract the new name from the request
    const newBranchName = branch?.BranchName?.trim();

    if (!newBranchName) {
      return sendResponse(res, 400, true, { BranchName: "Branch name is required" }, null);
    }

    // 1. Check if branch with given ID exists
    const findBranch = await BranchModel.findById(id);
    if (!findBranch) {
      return sendResponse(res, 404, true, { general: "Branch not found" }, null);
    }

    // 2. Check if another branch with the same name exists (excluding this one)
    const existingBranch = await BranchModel.findOne({
      branch: newBranchName
    });
// console.log(existingBranch);

    if (existingBranch) {
      return sendResponse(
        res,
        400,
        true,
        { BranchName: "Branch with this name already exists" },
        null
      );
    }

    // 3. Update the branch name
    const updatedBranch = await BranchModel.findByIdAndUpdate(
      id,
      { branch: newBranchName },
      { new: true, runValidators: true }
    );

    return sendResponse(
      res,
      200,
      false,
      {},
      { updatedBranch, message: "Branch updated successfully" }
    );
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};

 const EditAllCityController = async (req, res) => {
  try {
    const { id } = req.params;
    const { city } = req.body;

    const newCityName = city?.CityName?.trim();

    if (!newCityName) {
      return sendResponse(res, 400, true, { CityName: "City name is required" }, null);
    }

    // 1. Check if city with the given ID exists
    const findCity = await CityModel.findById(id);
    if (!findCity) {
      return sendResponse(res, 404, true, { general: "City not found" }, null);
    }

    // 2. Check for duplicate (excluding current city)
    const existingCity = await CityModel.findOne({
      
      city: newCityName,
    });
    console.log(existingCity);
    
    if (existingCity) {
      return sendResponse(
        res,
        400,
        true,
        { CityName: "City with this name already exists" },
        null
      );
    }

    // 3. Update city name
    const updatedCity = await CityModel.findByIdAndUpdate(
      id,
      { city: newCityName },
      { new: true, runValidators: true }
    );

    return sendResponse(
      res,
      200,
      false,
      {},
      { updatedCity, message: "City updated successfully" }
    );
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};




const DeleteAllBranchController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if branch exists
    const branch = await BranchModel.findById(id);
    if (!branch) {
      return sendResponse(res, 404, true, { general: "Branch not found" }, null);
    }

    // 2. Delete the branch
    await BranchModel.findByIdAndDelete(id);

    return sendResponse(
      res,
      200,
      false,
      {},
      { message: "Branch deleted successfully" }
    );
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};
 const DeleteAllCityController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if city exists
    const city = await CityModel.findById(id);
    if (!city) {
      return sendResponse(res, 404, true, { general: "City not found" }, null);
    }

    // 2. Delete the city
    await CityModel.findByIdAndDelete(id);

    return sendResponse(
      res,
      200,
      false,
      {},
      { message: "City deleted successfully" }
    );
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};


export {BranchController,CityController,GetAllBranchController,GetAllCityController,EditAllBranchController,DeleteAllBranchController,EditAllCityController, DeleteAllCityController}