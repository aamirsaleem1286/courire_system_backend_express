import {sendResponse} from '../helpers/sendResponse.js'
import shipmentSchemaModel from '../models/shipmentSchema.model.js'
import containerModel from '../models/container.model.js'
import containerNumberModel from '../models/containerNumber.model.js'
import mongoose from 'mongoose'

export const addBookingController = async (req, res) => {
    try {
        // console.log(req.body);
        
      const {
            BiltyNo,

            SenderName,
            SenderMobile,
            SenderIdNumber,
            SenderAddress,
            SenderArea,

            ReceiverName,
            ReceiverMobile1,
            ReceiverMobile2,
            ReceiverAddress,
            ReceiverArea,

            ItemDetails,
            OtherDetails,
          totalWeight,
            NoOfPieces,
            Branch,
            BookingDate,

            Charges,
            Discount,
            SubTotal,
            Vat,
            VatTotal,

            AmountInWords,
            InvoiceTotal,
            City

        } = req.body
        // console.log(TotalWeight);
        // console.log(UnitRate);
        let trackingId = BiltyNo  
        if (!trackingId) {
          trackingId = Math.floor(100000000000 + Math.random() * 900000000000); 
      }
      const haveTrackingId =await shipmentSchemaModel.findOne({BiltyNo: trackingId })
          if (haveTrackingId) {
                      return sendResponse(res,409,true,{general:"Tracking Id already registered"},null)
          }

        const previouInvoiceNo = await shipmentSchemaModel.findOne().sort({ createdAt: -1  })
        let invoiceNo
        if (previouInvoiceNo) {
            const [invoice] = previouInvoiceNo.InvoiceNo.split("/");
            const invoiceInt = parseInt(invoice) + 1 
            invoiceNo = `${invoiceInt}/${NoOfPieces}`
            
        }
        else {
            invoiceNo = `101/${NoOfPieces}`
        }

        const [invoiceId] = invoiceNo.split('/')
        const tracking_details = {
            invoiceId:invoiceId,
            containerNumber: 'N/A',
            pieces:NoOfPieces,
            currentStatusDate:new Date(),
            currentStatus:"Shipment in Godown",
        }
        const tracking_history = {
            invoiceId:invoiceId,
            containerNumber: 'N/A',
            pieces:NoOfPieces,
            oldStatusDate:tracking_details.currentStatusDate,
            oldStatus:"Shipment in Godown",
        }

        const newBooking = new shipmentSchemaModel(
            { 
              BiltyNo:trackingId, InvoiceNo:invoiceNo,SenderName,
                SenderName,
                SenderMobile,
                SenderIdNumber,
                SenderAddress,
                SenderArea,
                ReceiverName,
                 ReceiverMobile1,
                 ReceiverMobile2,
                ReceiverAddress,
                ReceiverArea,
                 ItemDetails,
                 OtherDetails,
                 totalWeight,
                NoOfPieces,
                 Branch,
                BookingDate,
                Charges,
                Discount,
                SubTotal,
                 Vat,
                VatTotal,
                AmountInWords,
                InvoiceTotal,
                City,
                tracking_details:[tracking_details],
                tracking_history:[tracking_history]

            }) 
        await newBooking.save()
        return sendResponse(res, 200, false, {}, {
            bookingData: {
                BiltyNo:trackingId, InvoiceNo:invoiceNo,SenderName,
                SenderName,
                SenderMobile,
                SenderIdNumber,
                SenderAddress,
                SenderArea,
    
                ReceiverName,
                ReceiverMobile1,
                ReceiverMobile2,
                ReceiverAddress,
                ReceiverArea,
                
                ItemDetails,
                OtherDetails,
    
                NoOfPieces,
                Branch,
                BookingDate,
    
                Charges,
                Discount,
                SubTotal,
                Vat,
                VatTotal,
    
                AmountInWords,
                InvoiceTotal,
                City
        },message:"Booking Registered Succesfully"})

    } catch (error) {
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const editBookingController = async (req, res) => {
    try {
      const { id } = req.params;
  
      const {
        BiltyNo, InvoiceNo, SenderName, SenderMobile, SenderIdNumber, SenderAddress, SenderArea,
        ReceiverName, ReceiverMobile1, ReceiverMobile2, ReceiverAddress, ReceiverArea,
        ItemDetails, OtherDetails,totalWeight,
        NoOfPieces, Branch, BookingDate,
        Charges, Discount, SubTotal, Vat, VatTotal,
        AmountInWords, InvoiceTotal,City
      } = req.body;
  
      const updateData = {
        BiltyNo, InvoiceNo, SenderName, SenderMobile, SenderIdNumber, SenderAddress, SenderArea,
        ReceiverName, ReceiverMobile1, ReceiverMobile2, ReceiverAddress, ReceiverArea,
        ItemDetails, OtherDetails,totalWeight,
        NoOfPieces, Branch, BookingDate,
        Charges, Discount, SubTotal, Vat, VatTotal,
        AmountInWords, InvoiceTotal,City
      };
  
      let bookingDoc;
  
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return sendResponse(res, 400, true, { general: "Invalid ID" }, null);
        }
  
        bookingDoc = await shipmentSchemaModel.findById(id);
      } else {
        bookingDoc = await shipmentSchemaModel.findOne({ BiltyNo });
      }
  
      if (!bookingDoc) {
        return sendResponse(res, 409, true, { general: "Booking not found" }, null);
      }
  
      await bookingDoc.updateOne(updateData);
  
      return sendResponse(res, 200, false, {}, {
        bookingData: updateData,
        message: "Booking Updated Successfully"
      });
  
    } catch (error) {
      return sendResponse(res, 500, true, { general: error.message }, null);
    }
  };
  
export const getBookingInvoicesController = async (req, res) => {
    try {
        const bookingInvoices =
        await shipmentSchemaModel.find({ RemainingPieces:{ $gt: 0 }}, 'InvoiceNo RemainingPieces' )
        // console.log(bookingInvoices);
        
        // const checkRemainigInvoices = await shipmentSchemaModel
        return sendResponse(res, 200,false,{}, {bookingInvoices,message:"Get all booking Invoices"});
    } catch (error) {
         return sendResponse(res,500,true,{ general: error.message },null)
    }
}

export const getAllBookingController = async (req, res) => {
  try {
    const bookings = await shipmentSchemaModel.find();

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const invoiceFull = booking.InvoiceNo;       // e.g. "101/5"
        const [invNo] = invoiceFull?.split("/") || [];

        const containers = invNo
          ? await containerModel.find({
              Invoices: { $elemMatch: { $regex: `^${invNo}/` } },
            })
          : [];

        // Collect statuses from all containers
        const statuses = containers
          .map(c => c.Status)
          .filter(Boolean);

        let statusList = [...new Set(statuses)]; // dedupe

        // 2. Check shipment remaining pieces
        if (booking.RemainingPieces > 0) {
          statusList.push("Shipment in Godown");
        }

        // 3. If all statuses are "delivered" (case-insensitive), replace with single lowercase
        if (
          statusList.length > 0 &&
          statusList.every(s => s.toLowerCase() === "delivered")
        ) {
          statusList = ["delivered"];
        }

        const status = statusList.join(", ");

        return {
          ...booking._doc,
          status,
        };
      })
    );

    return sendResponse(res, 200, false, {}, {
      bookings: enrichedBookings,
      message: "Get all bookings"
    });
  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};






export const getBookingSingleController = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, true, { general: "Invalid ID" }, null);
    }

    // 2. Find booking
    const builtyRecord = await shipmentSchemaModel.findById(id);

    if (!builtyRecord) {
      return sendResponse(res, 409, true, { general: "Booking not found" }, null);
    }

    // 3. Extract invoiceNo (e.g. "INV123" from "INV123/2")
    const [invoiceNo] = builtyRecord.InvoiceNo?.split("/") || [];

    let status = "Shipment in Godown"; // default

    if (invoiceNo) {
      // 4. Find containers that include this invoice
      const containers = await containerModel.find({
        Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } }
      });

      // 5. Extract and deduplicate statuses
      const statusArray = containers.map((c) => c.Status).filter(Boolean);
      const uniqueStatuses = [...new Set(statusArray)];

      if (uniqueStatuses.length > 0) {
        status = uniqueStatuses.join(", ");
      }
    }

    // 6. Return enriched result
    return sendResponse(res, 200, false, {}, {
      builtyRecord: {
        ...builtyRecord._doc,
        status,
      },
      message: "Builty fetched successfully!",
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};
 
// export const deleteBookingController = async (req, res) => {
//   try {
//     const { BiltyNo } = req.body;

//     // 1. Validate input
//     if (!BiltyNo) {
//       return sendResponse(res, 400, true, { general: "Bilty No is required" }, null);
//     }

//     // 2. Find the shipment
//     const builtyRecord = await shipmentSchemaModel.findOne({ BiltyNo });

//     if (!builtyRecord) {
//       return sendResponse(res, 409, true, { general: "Bilty not found" }, null);
//     }


//      const fullInvoice = builtyRecord.InvoiceNo;       // e.g. "INV001/3"
//     const invoiceNo = fullInvoice?.split('/')?.[0];
    
//     const containers = await containerModel.find({ Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } });
    
//     const allDelivered = containers.every(container => container.Status.toLowerCase() === 'delivered');
      
//       if (containers.length > 0 && allDelivered) {
//         await containerModel.updateMany(
//           { Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } },
//           { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
//         );
    
//         // // 5. Remove invoice from containerNumberModel
//         await containerNumberModel.updateMany(
//           { Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } },
//           { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
//         );
//      await builtyRecord.deleteOne();

//     return sendResponse(res, 200, false, {}, {
//       message: "Bilty deleted successfully!",
//     });
//     }
    
//     if (
//       builtyRecord.RemainingPieces < builtyRecord.NoOfPieces ||
//   builtyRecord.RemainingPieces === 0
// ){
//       return sendResponse(res, 400, true, { general: `This Booking is no more deletable already in process` }, null);
//     }

//     // // 3. Extract invoice number
//     // const fullInvoice = builtyRecord.InvoiceNo;       // e.g. "INV001/3"
//     // const invoiceNo = fullInvoice?.split('/')?.[0];   // e.g. "INV001"

//     // if (!invoiceNo) {
//     //   return sendResponse(res, 400, true, { general: "Invalid Invoice Number format" }, null);
//     // }


//     // // 4. Remove invoice from containerModel
//     // await containerModel.updateMany(
//     //   { Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } },
//     //   { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
//     // );

//     // // 5. Remove invoice from containerNumberModel
//     // await containerNumberModel.updateMany(
//     //   { Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } } },
//     //   { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
//     // );

//     // 6. Delete the shipment itself
//     await builtyRecord.deleteOne();

//     return sendResponse(res, 200, false, {}, {
//       message: "Bilty deleted successfully!",
//     });

//   } catch (error) {
//     return sendResponse(res, 500, true, { general: error.message }, null);
//   }
// };


export const deleteBookingController = async (req, res) => {
  try {
    const { BiltyNo } = req.body;

    if (!BiltyNo) {
      return sendResponse(res, 400, true, { general: "Bilty No is required" }, null);
    }

    const builtyRecord = await shipmentSchemaModel.findOne({ BiltyNo });
    if (!builtyRecord) {
      return sendResponse(res, 409, true, { general: "Bilty not found" }, null);
    }

    const fullInvoice = builtyRecord.InvoiceNo; // e.g. "INV101/6"
    const invoiceNo = fullInvoice?.split('/')?.[0]; // "INV101"

    const containers = await containerModel.find({
      Invoices: { $elemMatch: { $regex: `^${invoiceNo}/` } }
    });

    // STEP 1: Check all containers with this invoice have status = 'delivered'
    const allDelivered = containers.every(c =>
      c.Invoices.some(i => i.startsWith(`${invoiceNo}/`)) &&
      c.Status.toLowerCase() === 'delivered'
    );
    console.log(allDelivered);
    
    if (allDelivered) {
      // STEP 2: Remove invoice from containers (only delivered ones)
      for (const container of containers) {
        const hasThisInvoice = container.Invoices.some(i => i.startsWith(`${invoiceNo}/`));
  
        if (hasThisInvoice && container.Status.toLowerCase() === 'delivered') {
          // Remove the invoice from container
          container.Invoices = container.Invoices.filter(i => !i.startsWith(`${invoiceNo}/`));
  
          if (container.Invoices.length === 0) {
            // If container has no more invoices → delete container and containerNumber
            await containerModel.deleteOne({ _id: container._id });
            await containerNumberModel.deleteOne({ ContainerNumber: container.ContainerNumber });
          } else {
            // Else just update the invoice list
            await container.save();
            await containerNumberModel.updateOne(
              { ContainerNumber: container.ContainerNumber },
              { $pull: { Invoices: { $regex: `^${invoiceNo}/` } } }
            );
          }
        }
      }
      
      await builtyRecord.deleteOne();
        return sendResponse(res, 200, false, {}, {
      message: "Bilty deleted successfully!",
    });

    }

    console.log(builtyRecord.RemainingPieces);
    // console.log(builtyRecord.NoOfPieces);
    console.log(BiltyNo);
    
    // STEP 3: Check for partial booking condition
    if (
      // 10 < 10 = False
      // 10 === 0 False
      builtyRecord.RemainingPieces < builtyRecord.NoOfPieces ||
      builtyRecord.RemainingPieces === 0
    ) {
      return sendResponse(res, 400, true, {
        general: `This Booking is no more deletable — already in process.`,
      }, null);
    }

    // STEP 4: Finally delete bilty
    // STEP 4: Finally delete bilty
    await builtyRecord.deleteOne();

    return sendResponse(res, 200, false, {}, {
      message: "Bilty deleted successfully!",
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};

