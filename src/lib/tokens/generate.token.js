import jwt from 'jsonwebtoken'
const generateAccessToken = (payload) => {
    return jwt.sign(payload,process.env.AUTH_SECRET,{expiresIn:'1d'})
}
// const generateRefreshToken = (payload) => {
//     return jwt.sign(payload,env.REFRESH_SECRET,{expiresIn:'7d'})
// }
export {generateAccessToken}