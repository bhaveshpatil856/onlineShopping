let express= require('express');
let router= express.Router();
let bcrypt= require('bcrypt');
let user= require('../schema/user');
let Auth= require('../middleware/auth');
let Admin= require('../middleware/isAdmin');

router.get('/allUser', async(req,res) => {
    try {
        let data= await user.UserData.find()
                                     .select('firstname lastname');
        res.send({AllUsers: data});
    }
    catch(error){
        return res.status(404).send(error.message);
    }
});

router.post('/newUser', async(req,res)=> {
    try{
        let{error} = user.validateData(req.body);
        if(error) {return res.status(404).send(error.message)};

        let u=await user.UserData.findOne({"userLogin.userEmail":req.body.userLogin.userEmail});
        if(u){return res.status(403).send({message:'User emailId is Already Exist.....'})};

        let newData= new user.UserData({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            newsLetterCheck:  req.body.newsLetterCheck,
            userLogin:req.body.userLogin,
            address:req.body.address,
            termsAcceptCheck: req.body.termsAcceptCheck
        });
    
        let salt=await bcrypt.genSalt(10);
        newData.userLogin.userPassword= await bcrypt.hash(newData.userLogin.userPassword,salt);

        let saveData= await newData.save();
        console.log(saveData);

        res.send({message:"Registration Successfull......."});
    }
    catch(error){
        return res.status(404).send({error: error.message});
    }
});

router.delete('/deleteUser/:id',[Auth,Admin], async(req,res) => {
    try {        
        let u= await user.UserData.findByIdAndDelete(req.params.id);
        if(!u) {return res.status(402).send({message:"User Not Found"})};

        res.send({message:"User Successfully Deleted...."});
    }
    catch(error){
        return res.status(404).send(error.message);
    }
});

module.exports= router;