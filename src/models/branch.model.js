import mongoose from 'mongoose'

const BranchSchema = new mongoose.Schema({
    branch:{type:String,required:true}
},{
    timestamps:true
})

const BranchModel = mongoose.model('branches', BranchSchema)

export default BranchModel