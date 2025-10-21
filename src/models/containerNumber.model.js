import mongoose from 'mongoose'

const containerNumberSchema = new mongoose.Schema({
    ContainerNumber: { type: String, required: true },
    From:{type:String,required:true},
    To: { type: String, required: true },
    Invoices:{type:[String],default:null}
}, {
    timestamps:true
})

const containerNumberModel = mongoose.model('containerNumber', containerNumberSchema)

export default containerNumberModel