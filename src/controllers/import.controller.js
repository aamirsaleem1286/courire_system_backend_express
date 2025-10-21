import xlsx from "xlsx";
import shipmentSchema from "../models/shipmentSchema.model.js";

export const importexcel = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read Excel
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Mapping
    const shipments = data.map((row) => ({
      SenderName: row["Sender Name"],
      SenderMobile: row["Sender Mobile"],
      SenderIdNumber: row["Sender Id Number"],
      SenderAddress: row["Sender Address"],
      SenderArea: row["Sender Area"],
      ReceiverName: row["Receiver Name"],
      ReceiverMobile1: row["Receiver Mobile1"],
      ReceiverMobile2: row["Receiver Mobile2"],
      ReceiverAddress: row["Receiver Address"],
      ReceiverArea: row["Receiver Area"],
      ItemDetails: row["Item Details"],
      OtherDetails: row["Other Details"],
      NoOfPieces: row["No Of Pieces"],
      Branch: row["Branch"],
      BookingDate: row["Booking Date"],
      SubTotal: row["Sub Total"],
      Vat: row["Vat"],
      VatTotal: row["Vat Total"],
      InvoiceTotal: row["Invoice Total"],
      AmountInWords: row["Amount In Words"],
      BiltyNo: row["Bilty No"],
      InvoiceNo: row["Invoice No"],
      City: row["City"],
      TrackingDetails: row["Tracking Details"],
      TrackingHistory: row["Tracking History"],
      Status: row["Status"],
      totalWeight: row["No Of Pieces"], // agar ye required hai schema me
    }));

    // Save to DB
    await shipmentSchema.insertMany(shipments);

    res.status(200).json({ message: "Excel Imported Successfully!" });
  } catch (error) {
    console.error("Error importing Excel file:", error);
    res.status(500).json({ message: "Error importing Excel file", error });
  }
};
