import {sendResponse} from '../helpers/sendResponse.js'
import UserModel from '../models/user.model.js';
export const userController = async (req, res) => {
    try {
        console.log(req.user);
        
     const {email} = req.user
    sendResponse(res, 200, false, {},{email})       
    } catch (error) {
        return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
export const getUserController = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password') 
        
        sendResponse(res, 200, false, {},{users,message:"Users fetch successfully"})       
} catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);       
    }
}
export const deleteUserController = async (req, res) => {
    try {
        const { id } = req.params;

    // 1. Check if branch exists
    const user = await UserModel.findById(id);
    if (!user) {
      return sendResponse(res, 404, true, { general: "User not found" }, null);
    }

    // 2. Delete the branch
    await UserModel.findByIdAndDelete(id);

    return sendResponse(
      res,
      200,
      false,
      {},
      { message: "User deleted successfully" }
    );       
} catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);       
    }
}