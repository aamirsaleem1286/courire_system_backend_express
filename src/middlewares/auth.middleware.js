import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { sendResponse } from '../helpers/sendResponse.js'
import 'dotenv/config'
export const authenticate_user = async (req,res,next) => {
    try {
        const authHeader = req?.headers?.authorization
        const token = authHeader?.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.AUTH_SECRET)
        } catch(error) {
            return sendResponse(res,401,true,{general:"Invalid access token"},null)
        }
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return sendResponse(res, 401, true, { general: 'User not found' }, null);
        }
        req.user = user;

        next()
    } catch (error) {
        sendResponse(res,500,true,{general:`Something went wrong ${error.message}`},null);
    }
}