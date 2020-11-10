let express= require('express');
let router= express.Router();
let nodemailer= require('nodemailer');
let crypto= require('crypto');
let config= require('config');
let user= require('../schema/user');

router.post('/mail',async(req,res)=>{
    try{
        let u= await user.UserData.findOne({"userLogin.userEmail":req.body.userLogin.userEmail});
        if(!u) { return res.status(404).send({message:"Email ID not found"})};

        let transporter = new nodemailer.createTransport({
            host:"smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user:"bhaveshpatil856@gmail.com",
                pass: config.get('dbPassword')
            }
        });
        if(!transporter){
            return res.status(403).send({message:"something went Wrong"});
        };

        //console.log(transporter);
        let mail= {
            from:"bhavesh patil: <bhaveshpatil856@gmail.com",
            to: u.userLogin.userEmail,
            subject: "Welcome",
            text: "Welcome..... \n registation successfull.... \n Welcome to the Website.."
        };

        console.log(mail);

        transporter.sendMail(mail, (error,info)=>{
            if(error){
                return console.log(error);
            }

            res.send({message:"check your mail", user: u.userLogin.userEmail});
        });
        
    }
    catch(error){
        console.log(error);
        return res.status(404).send({message: error.message});
    }    
});

module.exports= router;