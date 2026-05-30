import jwt from 'jsonwebtoken';
import config from '../../config/index.js'

const generateToken=(payload)=>{

    //iconsole.log(config.JWT_PRIVATE_KEY);
    return jwt.sign(payload,config.JWT_PRIVATE_KEY,{algorithm:'RS256',expiresIn:'30d',issuer:'auth-microservice'});
}
const verifyToken=(token)=>{
    try{
    return jwt.verify(token,config.JWT_PUBLIC_KEY,{algorithm:'RS256',issuer:'auth-microservice'});
    }
    catch(error){
        console.log("Invalid Token");
        return null;
    }
}

export {generateToken,verifyToken}