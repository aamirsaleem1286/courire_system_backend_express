import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password:{type: String, required: true},
    role:{type: String, required: true, default: 'user'},
})

const UserModel = mongoose.model('users', UserSchema)

export default UserModel