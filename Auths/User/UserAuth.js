import jwt from 'jsonwebtoken'

export function UserAuth(request,response,next){
    const accessToken = request.cookies.access_token

    try {
       if(!accessToken){return response.status(401).json({success:false,message:"Please log in first to continue"})}
        next()
    } catch (error) {
        console.log('error userauth ',error.message);
        return response.status(500).json({success:false, message:"Internal server error!"})
    }
}