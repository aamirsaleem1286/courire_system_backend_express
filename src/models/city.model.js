import mongoose from 'mongoose'

const CitySchema = new mongoose.Schema({
    city:{type:String,required:true}
},{
    timestamps:true
})

const CityModel = mongoose.model('cities', CitySchema)

export default CityModel