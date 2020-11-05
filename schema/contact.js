let mongoose= require('mongoose');
let joi= require('joi');

let contactSchema= mongoose.Schema({
    name:{type:String,required:true,min:5,max:250},
    email:{type:String,required:true,min:5,max:250},
    personalMessage:{type:String,required:true,min:5,max:250}
});

let contactModel= mongoose.model('Contact',contactSchema);

function validateData(error){
    let schema= joi.object({
        name: joi.string().min(5).max(250).required(),
        email: joi.string().min(5).max(250).required(),
        personalMessage: joi.string().min(5).max(250).required()
    });

    return schema.validate(error);
}

module.exports={
    contactModel,contactSchema,validateData
};