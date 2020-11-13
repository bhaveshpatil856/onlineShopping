function Admin(req,res,next) {
   
    if(!req.userData.isAdmin){
        return res.status(401).send({message:"Access Denied..."});
    }

    next();
    
}

module.exports= Admin;