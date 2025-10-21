import shipmentSchema from '../models/shipmentSchema.model.js';
import { sendResponse } from '../helpers/sendResponse.js';
import containerModel from '../models/container.model.js';

export const getTrackingController = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const foundTrackingId = await shipmentSchema.findOne({ BiltyNo: trackingId });

    if (!foundTrackingId) {
      return sendResponse(res, 404, true, { trackingId: "No tracking Id found" }, null);
    }

    const invoiceNo = foundTrackingId.InvoiceNo; // e.g., '101/10'
    if (!invoiceNo || !invoiceNo.includes('/')) {
      return sendResponse(res, 400, true, { general: "Invalid InvoiceNo format" }, null);
    }

    const [invoiceId] = invoiceNo.split('/');
    const totalPieces = parseInt(foundTrackingId.NoOfPieces || 0);
    const remainingPieces = parseInt(foundTrackingId.RemainingPieces || 0);

    const containers = await containerModel.find({
      Invoices: { $elemMatch: { $regex: `^${invoiceId}/\\d+$` } }
    });

    let shipmentParts = [];
    let totalContainerPieces = 0;

    for (const container of containers) {
      for (const inv of container.Invoices) {
        const [invId, pieceStr] = inv.split('/');
        if (invId === invoiceId) {
          const pieces = parseInt(pieceStr || 0);
          totalContainerPieces += pieces;

          shipmentParts.push({
            location: "Container",
            pieces,
            status: container.Status || "Shipment In Container",
            container,
            invoiceId,
            trackingId
          });
        }
      }
    }

    // Add godown part if any remaining
    const godownPieces = remainingPieces;
    if (godownPieces > 0) {
      shipmentParts.push({
        location: "Godown",
        pieces: godownPieces,
        status: "Shipment at Godown",
        invoiceId,
        trackingId
      });
    }

    // Fallback status if no parts found
    if (shipmentParts.length === 0) {
      shipmentParts.push({
        location: "Unknown",
        status: "Status not available",
        pieces: totalPieces,
        invoiceId,
        trackingId
      });
    }

    // 👇 yahan update kiya gaya hai
    const updatedTracking = {
      ...foundTrackingId.toObject(),
      totalWeight: foundTrackingId.totalWeight,
    };

    return sendResponse(res, 200, false, {}, {
      foundTrackingId: updatedTracking, // 👈 totalWeight ab andar hai
      shipmentParts,
      message: "Tracking ID found successfully",
    });

  } catch (error) {
    return sendResponse(res, 500, true, { general: error.message }, null);
  }
};
