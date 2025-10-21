import mongoose from 'mongoose'
import express from 'express'
import BookingRouter from '../src/routers/booking.router.js'
import ContainerRouter from '../src/routers/container.router.js'
import WhatsappRouter from '../src/routers/whatsapp.router.js'
import TrackingRouter from '../src/routers/tracking.router.js'
import AuthRouter from '../src/routers/auth.router.js'
import UserRouter from '../src/routers/user.router.js'
import CountryRouter from '../src/routers/country.router.js'
import ContainerNumberRouter from '../src/routers/container_number.router.js'
import 'dotenv/config'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cors())
app.get('/', (req,res) => {
    res.send('Server is up and running!!!!')
})

// console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('db connected succesfully')
    app.use('/api',BookingRouter)
    app.use('/api',ContainerRouter)
    app.use('/api', TrackingRouter)
    app.use('/api', WhatsappRouter)
     app.use('/api/auth',AuthRouter)
     app.use('/api',UserRouter)
     app.use('/api',CountryRouter)
     app.use('/api',ContainerNumberRouter)
    app.use('/uploads', express.static('uploads'));
    
    app.listen(5000, () => {
        console.log(`Server is running on port ${5000}`);
        
    })
    
}).catch((e) => {
        console.log("err=>",e);
        
    });