let express=require('express');
let router= express.Router();
let cartItem = require('../schema/cartItem');
let product= require('../schema/products');
let user= require('../schema/user');


router.post("/addToCart", async(req,res)=>{
    try {

        let p = await product.productModel.findById(req.body.productId);
        if(!p){return res.status(404).send({message:"product not found..."})};
        
        let u= await user.UserData.findOne({"userLogin.userEmail":req.body.userLogin.userEmail});
        if(!u){return res.status(404).send({message:"user not found"})};

        let data= new cartItem.cartItem({
            productId: p._id,
            name: p.name,
            image: p.image,
            price: p.offerPrice,
            quantity: req.body.quantity,
            totalPrice: (p.offerPrice*req.body.quantity)
            // recordDate:{type:Date,default:Date.now},
            // updateDate:{type:Date,default:Date.now} 
        });

        // console.log(data);


        // let a= await data.save();
        // res.send(a);
        
        // console.log(a)
        
        let userCart= new cartItem.userCart({
                userEmail: u.userLogin.userEmail,
                cartItems: data
            });

        let c=await userCart.save();
        res.send(c);
        console.log(c);

    }
    catch(error){
        return res.status(404).send(error.message);
    }
});

router.get("/allUserCart", async(req,res) => {
    let c= await cartItem.userCart.find();
    res.send(c);
});

router.post('/cartByUser', async(req,res) => {
    let c= await cartItem.userCart.find({"userEmail":req.body.userEmail});
   // if(c==null){ return res.status(404).send({message:"Empty cart...."})};

    res.send(c);
})

router.delete('/removeCartItem/:id', async(req,res) => {
    let d= await cartItem.userCart.findByIdAndDelete(req.params.id);
    if(!d){return res.status(404).send({message:"Item not Found..."})};

    res.send({message:"Item deleted Successfully....",data: d});
});
module.exports= router;