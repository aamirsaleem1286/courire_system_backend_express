import UserModel from '../models/user.model.js'
import {sendResponse} from '../helpers/sendResponse.js'
import bcrypt from 'bcrypt'
import { generateAccessToken } from '../lib/tokens/generate.token.js'

export const register_controller = async (req, res) => {
    try {
        let { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (user) return sendResponse(res, 409, true, { email: "User already register" }, null)
        
        const hash_password = await bcrypt.hash(password,10)
        password = hash_password
        
        
        const new_user = new UserModel({
        email,password
        })

        
        await new_user.save()
        return sendResponse(res,200,false,{},{message:"User Registered Succesfully."})

    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        // console.log(email);
        // console.log(password);
        
        // find user
        const user = await UserModel.findOne({email})
        if (!user) {
            return sendResponse(res,409,true,{email:"User is not registered"},null)
        }
        
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if (!isPasswordValid) return sendResponse(res, 401, true, { email: "Invalid email or password" }, null);
        
        const accessToken = generateAccessToken({ id: user._id, email: user.email })
        
        const userData = {
            email:user.email,accessToken,
            role:user.role
        }

        return sendResponse(res,200,false,{},{userData,message:"User Login Successfully"})
          
    } catch (error) {
          return sendResponse(res, 500, true, { general: error.message }, null);
    }
}
