let mongoose= require('mongoose');
let joi= require('joi');
let subCat=require('./subCategoryModel');

let categorySchema= mongoose.Schema({
    categoryName: {type:String,min:1,max:250,required:true},
    subCategory: [subCat.subCatSchema]
});

let categoryModel= mongoose.model('Category',categorySchema);

function validateData(error){
    let schema= joi.object({
        categoryName: joi.string().min(1).max(250).required(),
        subCategoryId: joi.string().min(3).max(150)
    });

    return schema.validate(error);
}

module.exports= {
    categorySchema,categoryModel,validateData
};