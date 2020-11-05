let express= require('express');
let router= express.Router();
let contact= require('../schema/contact');

router.get('/allContact', async(req,res) => {
    let data= await contact.contactModel.find()
                                        .select('name');

    res.send({data: data});
});

router.post('/newContact', async(req,res) => {
    let {error}= await contact.validateData(req.body);
    if(error) {return res.status(404).send(error.message)};

    let email= await contact.contactModel.findOne({"email":req.body.email});
    if(email){return res.status(400).send({message:"Email already exists"})};

    let data= new contact.contactModel({
        name: req.body.name,
        email: req.body.email,
        personalMessage: req.body.personalMessage
    });
    
    await data.save();

    console.log(data);

    res.send({message:"Contact Added...."});


});

module.exports= router;