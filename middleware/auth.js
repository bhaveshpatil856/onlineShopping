let config= require('config');
let jwt= require('jsonwebtoken');

function Auth(req,res,next) {
   let token= req.header('x-auth-token');
   if(!token){
       return res.status(401).send({message:"Token not found"});
   }
   
   try {
       let decode= jwt.verify(token, config.get('jwtPrivateKey'));
       req.userData= decode;
       next();
   } catch (error) {
        return res.status(404).send(error.message);       
   }
};

module.exports= Auth;