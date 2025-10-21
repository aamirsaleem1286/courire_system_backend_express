import { sendResponse } from "../helpers/sendResponse.js";
import twilio from 'twilio'
import 'dotenv/config'
import fs from 'fs'
import 'dotenv/config'
import shipmentSchemaModel from '../models/shipmentSchema.model.js'
import cloudinary from '../lib/configs/cloudinary.config.js'
// import { v2 as cloudinary } from 'cloudinary';

export const whatsappController = async (req, res) => {
  try {
    const files = req.files;
    let { whatsappNumbers } = req.body;
    // ✅ Validation
    if (
      (!files.marketingImage || files.marketingImage.length === 0) &&
      (!files.marketingFile || files.marketingFile.length === 0)
    ) {
      return sendResponse(res, 400, true, {
        general: 'Either marketingImage or marketingFile is required.',
      }, null);
    }

    if (
      files.marketingImage &&
      files.marketingImage.length > 0 &&
      files.marketingFile &&
      files.marketingFile.length > 0
    ) {
      return sendResponse(res, 400, true, {
        general: 'Only one of marketingImage or marketingFile should be uploaded, not both.',
      }, null);
    }

    if (!Array.isArray(whatsappNumbers)) {
  if (whatsappNumbers) {
    whatsappNumbers = [whatsappNumbers];
  } else {
    whatsappNumbers = [];
  }
}

if (whatsappNumbers.length === 0) {
  return sendResponse(res, 400, true, {
    general: "No WhatsApp numbers provided.",
  }, null);
}

    // ✅ Safe Extraction
    const marketingImageFile = files.marketingImage?.[0] || null;
    const marketingFile = files.marketingFile?.[0] || null;

    let uploadedFileUrl = '';
    let publicId = ''; // to store for deletion
    let resourceType = 'image'; 
  // console.log("marketingFile:", marketingFile);
// console.log("originalname:", marketingFile?.originalname);

    if (marketingImageFile) {
      const ext = marketingImageFile.originalname.split('.').pop().toLowerCase();
      resourceType = 'image'; 
      const result = await cloudinary.uploader.upload(
        marketingImageFile.path,
        { folder: "whatsapp-media",resource_type:resourceType }
      );
      uploadedFileUrl = result.secure_url;
      publicId = result.public_id;
    }
    else if (marketingFile) {
       const ext = marketingFile.originalname.split('.').pop().toLowerCase();
        if (ext === 'mp4') {
          resourceType = 'video';
        } else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) {
          resourceType = 'raw';
        } else {
          resourceType = 'image';
        }
//  console.log("resourceType",resourceType);
 
       
      const result = await cloudinary.uploader.upload(
        marketingFile.path,
        { folder: "whatsapp-media",resource_type:resourceType }
      );
      // console.log("save to cloudinary",result.secure_url);
      
      uploadedFileUrl = result.secure_url;
      publicId = result.public_id;
    }

    // ✅ Twilio setup
    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    const client = twilio(accountSid, authToken);

    // ✅ Send to all numbers
    for (let number of whatsappNumbers) {
      await client.messages.create({
        from: `whatsapp:${process.env.twilio_number}`,
        to: `whatsapp:${number}`,
        body: 'Here is the file 📎',
        mediaUrl: [uploadedFileUrl],
      });
    }

    // ✅ Delete from Cloudinary after all messages are sent
//   if (publicId) {
//   const ext = (marketingFile?.originalname || marketingImageFile?.originalname || '').split('.').pop().toLowerCase();
//   console.log(ext);

//   let resourceType
//     if (ext === 'mp4') {
//       resourceType = 'video';
//     } else if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) {
//       resourceType = 'raw';
//     } else {
      
//       resourceType = 'image';
//     }
// console.log(resourceType);

//   await cloudinary.uploader.destroy(publicId, {
//     resource_type: resourceType
//   });
//   console.log("⛔ Deleting file from cloudinary", publicId, "with type:", resourceType);
    // }
    if (publicId) {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    // console.log("✅ Deleted from Cloudinary:", publicId, "Type:", resourceType);
  } catch (error) {
    return sendResponse(res, 400, true, { general: "Error in cloudinary" }, null);
  }
}


    return sendResponse(res, 200, false, {}, {
      message: "Messages sent successfully!",
      total: whatsappNumbers.length,
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};


export const GetWhatsappNumberController = async (req, res) => {
  try {
    // Get all required fields only
    const allShipments = await shipmentSchemaModel.find({}, {
      SenderMobile: 1,
      SenderArea: 1,
      ReceiverMobile1: 1,
      ReceiverMobile2: 1,
      ReceiverArea: 1,
      _id: 0
    });

    // Format response
    const result = allShipments.map(shipment => ({
      sender: {
        number: shipment.SenderMobile,
        area: shipment.SenderArea
      },
      receiver: {
        number1: shipment.ReceiverMobile1,
        number2: shipment.ReceiverMobile2,
        area: shipment.ReceiverArea
      }
    }));
    // console.log(result);
    
    return sendResponse(res, 200, false, null, {result,message:'All numbers fetch successfully'});

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};
