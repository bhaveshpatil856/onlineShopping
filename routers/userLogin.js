let express= require('express');
let router= express.Router();
let bcrypt= require("bcrypt");
let joi=require('joi');
let user=require('../schema/user');
const Auth = require('../middleware/auth');



router.get('/me',Auth, async(req,res) => {
    
    // console.log(req.userData._id);
    
    try {
        
        let u= await user.UserData.findById(req.userData._id).select("-userLogin.userPassword");
        // console.log(u);
       // console.log('hi');
        if(!u){
            return res.status(403).send({message:"invalid loggedin user"})
        }
        res.send({user: u});
    } 
    catch(error){
        return res.status(500).send({message:error.message});
    }
});

router.post('/userLogin', async(req,res) => {
    try{
        let{error}= validateData(req.body);
        if(error){return res.status(404).send(error.details[0].message)};

        let email=await user.UserData.findOne({"userLogin.userEmail":req.body.userLogin.userEmail});
        if(!email){return res.status(402).send({message:"User Not Found....... Please Register First"})};
    
        let pass= await bcrypt.compare(req.body.userLogin.userPassword, email.userLogin.userPassword);
        if(!pass){return res.status(401).send({message:"Invalid Password... Try Again"})};
        
        let token= email.getUserToken();
        console.log(token);

        console.log(email);

        res.header('x-auth-token', token).send({message:"Login Successfull.... WELCOME", token: token});
    
        

    }
    catch(error){
           return res.status(404).send(error.message);
    }
});

function validateData(error){
    schema= joi.object({
        userLogin:{
            userEmail: joi.string().required().email(),
            userPassword: joi.string().required()
        }
    });

    return schema.validate(error);
}

module.exports= router;