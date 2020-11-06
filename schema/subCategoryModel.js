let mongoose= require('mongoose');
let joi= require('joi');

let subCatSchema= mongoose.Schema({
    name: {type:String,min:1,max:250,required:true},
    catName: {type:String}
});

let subCatModel= mongoose.model('SubCategory',subCatSchema);

function validateData(error){
    let schema= joi.object({
        name: joi.string().min(1).max(250).required(),
        catName: joi.string()
    });

    return schema.validate(error);
}

module.exports= {
    subCatModel,subCatSchema,validateData
};