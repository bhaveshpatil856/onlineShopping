let express= require('express');
let router= express.Router();
let user = require('../schema/user');
let bcrypt= require('bcrypt');

router.post('/resetPassword/:token', async(req,res)=> {
    let u= await user.UserData.findOne({"resetPasswordToken": req.params.token,"resetPasswordExpires":{$gt: Date.now()}});
    if(!u){return res.status(404).send({message:"Invalid Token"})};

    u.userLogin.userPassword= req.body.password;
    u.resetPasswordToken= undefined;
    u.resetPasswordExpires= undefined;
    
    let salt= await bcrypt.genSalt(10);
    u.userLogin.userPassword= await bcrypt.hash(u.userLogin.userPassword,salt);

    await u.save();

    res.send({message:"Password Updated successfully...... go to login Page"});
});

module.exports= router;