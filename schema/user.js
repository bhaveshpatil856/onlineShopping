let mongoose= require('mongoose')
let joi= require('joi')

let userSchema= mongoose.Schema({
    firstname:{type:String,required:true,min:5,max:250},
    lastname:{type:String,required:true,min:5,max:250},
    newsLetterCheck:{type:Boolean},
    userLogin:{
        userEmail:{type:String,required:true,unique:true},
        userPassword:{type:String,required:true}
    },
    termsAcceptCheck:{type:Boolean,required:true},
    resetPasswordToken:{type:String},
    resetPasswordExpires:{type:Date},
    isAdmin:{type:Boolean},
    recordDate:{type:Date,default:Date.now},
    updateDate:{type:Date,default:Date.now}
});

let UserData= mongoose.model('UserData',userSchema);

function validateData(error){
    let schema= joi.object({
        firstname: joi.string().min(5).max(250).required(),
        lastname: joi.string().min(5).max(250).required(),
        newsLetterCheck: joi.boolean(),
        userLogin:{
            userEmail: joi.string().required().email(),
            userPassword: joi.string().required()
        },
        termsAcceptCheck: joi.boolean().required().invalid(false)
        // resetPasswordToken: joi.string(),
        // resetPasswordExpires: joi.Date(),
        // isAdmin: joi.boolean(),
        // recordDate: joi.Date(),
        // updateDate: joi.Date()
    });

    return schema.validate(error);
}

module.exports= {
    userSchema,UserData,validateData
}