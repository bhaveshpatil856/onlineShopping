let mongoose= require('mongoose');
let joi= require('joi');
let Category= require('../schema/categoryModel');
let SubCategory= require('../schema/subCategoryModel');
const { date } = require('joi');

let productSchema= mongoose.Schema({
    name: {type:String,min:5,max:250,required:true},
    image: {type:String,min:5,max:250,required:true},
    description: {type:String,min:5,required:true},
    price: {type:Number,required:true,minlength:1},
    quantity: {type:Number,equired:true,minlength:1},
    offerPrice: {type:Number,required:1,minlength:1},
    isAvailable: {type:Boolean,required:true},
    isTodayOffer: {type:Boolean,required:true},
    category:{type: Category.categorySchema, required:true},
    subCategory: {type:SubCategory.subCatSchema, required:true},
    recordDate: {type:Date, default:Date.now},
    updateDate: {type:Date, default:Date.now}
});

let productModel= mongoose.model('Product',productSchema);

function validateDate(error){
    let schema= joi.object({
        name: joi.string().min(5).max(250).required(),
        //image: joi.string().min(5).max(250).required(),
        description: joi.string().min(5).required(),
        price: joi.number().min(1).required(),
        quantity: joi.number().min(1).required(),
        offerPrice: joi.number().min(1).required(),
        isAvailable: joi.boolean().required(),
        isTodayOffer: joi.boolean().required(),
        category: joi.string().required(),
        subCategory:  joi.string().required()
    });

    return schema.validate(error);
}

module.exports={
    productModel,productSchema,validateDate
};

