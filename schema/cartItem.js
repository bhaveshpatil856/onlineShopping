let mongoose= require('mongoose');
let joi= require('joi');

let cartItemSchema= mongoose.Schema({
    productId:{type:String,min:3,max:250},
    name:{type:String,min:3,max:250},
    image:{type:String,min:3,max:250},
    price:{type:Number,required:true,minlenght:1},
    quantity:{type:Number,required:true,minlenght:1},
    totalPrice:{type:Number,required:true,minlenght:1},
    recordDate:{type:Date,default:Date.now},
    updateDate:{type:Date,default:Date.now}
});

let cartItem= mongoose.model('CartItem',cartItemSchema);

let userCartSchema= mongoose.Schema({
    userEmail: {type:String,required:true,min:5,max:250},
    address: {type:String,required:true,min:5},
    cartItems: {type: cartItemSchema, required:true}
});

let userCart= mongoose.model('UserCart',userCartSchema);

function validateCartData(error){
    let schema= joi.object({
        productId: joi.string().min(3).max(250).required(),
        name: joi.string().min(3).max(250).required(),
        image: joi.string().min(3).max(250).required(),
        price: joi.number().min(1).required(),
        quantity: joi.number().min(1).required(),
        totalPrice: joi.number().min(1).required()
    });
}

module.exports={
    userCart,cartItem,userCartSchema,cartItemSchema,validateCartData
};