import mongoose from 'mongoose'

const trackingDetails = new mongoose.Schema({
    invoiceId:{type:String,required:true},
    containerNumber:{type:String},
    pieces:{type:Number,required:true},
    currentStatusDate:{ type: Date, required:true },
    currentStatus:{ type: String, required: true },
});
const trackingHistory = new mongoose.Schema({
    invoiceId:{type:String,required:true},
    containerNumber:{type:String,required:true},
    pieces:{type:Number,required:true},
    oldStatusDate: { type: Date, required:true },
    oldStatus: { type: String, required: true },
    remarks: { type: String },
    location: { type: String }, 
    
});



const shipmentSchema = new mongoose.Schema(
  {
    SenderName: { type: String, required: true },
    SenderMobile: { type: String, required: true },
    SenderIdNumber: { type: String, required: true },
    SenderAddress: { type: String, required: true },
    SenderArea: { type: String, required: true },

    ReceiverName: { type: String, required: true },
    ReceiverMobile1: { type: String, required: true },
    ReceiverMobile2: { type: String, required: true },
    ReceiverAddress: { type: String, required: true },
    ReceiverArea: { type: String, required: true },

    ItemDetails: { type: String },
    totalWeight:{type: String, },

    OtherDetails: { type: String },

    NoOfPieces: { type: Number, required: true },
    RemainingPieces: {
      type: Number,
      required: true,
      default: function () {
        return this.NoOfPieces;
      },
    },

    Branch: { type: String, required: true },
    BookingDate: { type: String, required: true }, // format: YYYY-MM-DD

    Charges: {
      FreightCharges: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      Insurance: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      Packing: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      Customs: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      Clearance: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      OtherCharges: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      Discount: {
        enabled: { type: Boolean, default: false },
        unitRate: { type: Number, default: 0 },
        qty: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
    SubTotal: { type: Number },
    Vat: { type: Number },
    VatTotal: { type: Number },
    InvoiceTotal: { type: Number },

    AmountInWords: { type: String },

    BiltyNo: { type: String },
    InvoiceNo: { type: String },
    City: { type: String, required: true },
    tracking_details: {
      type: [trackingDetails],
      required: true,
    },
    tracking_history: {
      type: [trackingHistory],
      required: true,
    },
  },
  {
    timestamps: true,
  }
); 

const shipmentSchemaModel = mongoose.model('shipmentSchemas', shipmentSchema)

export default shipmentSchemaModel
