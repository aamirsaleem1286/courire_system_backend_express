import express from 'express'
import {addBookingController,getBookingInvoicesController,getAllBookingController,deleteBookingController,editBookingController,getBookingSingleController} from '../controllers/booking.controller.js'
const router = express.Router() 

router.post('/addBooking', addBookingController)
router.post('/editBooking', editBookingController)

router.get('/getBookingById/:id', getBookingSingleController)

router.post('/editBookingById/:id', editBookingController)


router.get("/allBookingInvoiceNo",getBookingInvoicesController)
router.get("/bookings",getAllBookingController)
router.delete("/deleteBooking",deleteBookingController)
export default router