let express= require('express');
let router= express.Router();
let nodemailer= require('nodemailer');
let user= require('../schema/user');
let config= require('config');
let crypto= require('crypto');

router.post('/forgetPassword', async(req,res) => {
    try{
        let u = await user.UserData.findOne({"userLogin.userEmail":req.body.userLogin.userEmail});
        if(!u){return res.status(404).send({message:"user not found"})};

        let token= crypto.randomBytes(35).toString("hex");

        u.resetPasswordToken= token;
        u.resetPasswordExpires= Date.now()+ 360000;
        u.save();

        let transporter= new nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user:"bhaveshpatil856@gmail.com",
                pass: config.get("dbPassword")
            }
        });
        if(!transporter){
            return res.status(404).send({message:"something went WRONG"});
        };

        let mail= {
            from:"Bhavesh Patil : <bhaveshpatil856@gmail.com>",
            to: u.userLogin.userEmail,
            subject: "Forget Password",
            text: "To reset password click on the given Link \n http://localhost:4800/api/resetPassword/" + token
        }

        transporter.sendMail(mail, (error,info)=>{
            if(error){
                return console.log(error.message);
            }

            res.send({message:"check your mail"});
        });
        
        
    }
    catch(error){
        return res.status(404).send({message: error.message});
    }
});

module.exports= router;