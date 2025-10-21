import mongoose from 'mongoose'

const containerSchema = new mongoose.Schema({
    ContainerNumber: { type: String, required: true },
    Destination: {
        From: {
            type: String,
            required: true,
          },
          To: {
            type: String,
            required: true,
          },
  },
  Invoices: { type: [String], required: true },
    Status:{type:String,required:true}
}, {
    timestamps:true
})

const containerModel = mongoose.model('containerBookings', containerSchema)

export default containerModel