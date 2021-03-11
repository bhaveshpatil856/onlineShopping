let express=require('express');
let router= express.Router();
let cartItem = require('../schema/cartItem');
let product= require('../schema/products');
let user= require('../schema/user');
let Auth= require('../middleware/auth');

router.post("/addToCart", async(req,res)=>{
    try {

        console.log({'line12' : req.body});

        let p = await product.productModel.findById(req.body.productId);
        if(!p){return res.status(404).send({message:"product not found..."})};
        
        let u= await user.UserData.findOne({"userLogin.userEmail":req.body.userLogin.userEmail});
        if(!u){return res.status(404).send({message:"user not found"})};

        let cartId= await cartItem.userCart.findOne({"userEmail":req.body.userLogin.userEmail} && {"cartItems.productId": req.body.productId});
        console.log({"data" : cartId});

        if(cartId){
            cartId.cartItems.quantity= cartId.cartItems.quantity + 1; 
            cartId.cartItems.totalPrice = cartId.cartItems.offerPrice * cartId.cartItems.quantity;
            cartId.cartItems.updateDate= Date.now();

            console.log(cartId);
            await cartId.save();
            res.send(cartId);
        }
//        console.log()

  else{      
      let data= new cartItem.cartItem({
            productId: p._id,
            name: p.name,
            image: p.image,
            offerPrice : p.offerPrice,
            price: p.price,
            quantity: req.body.quantity,
            totalPrice: (p.offerPrice*req.body.quantity)
            // recordDate:{type:Date,default:Date.now},
            // updateDate:{type:Date,default:Date.now} 
        });

        // console.log(data.offerPrice);

        // let a= await data.save();
        // res.send(a);
        
        // console.log(a)
        
        let userCart= new cartItem.userCart({
                userEmail: u.userLogin.userEmail,
                address: u.address,
                cartItems: data
            });

        let c=await userCart.save();
        console.log(c);


        res.send(c);
}
    }
    catch(error){
        return res.status(404).send(error.message);
    }
});

router.get("/allUserCart", async(req,res) => {
    try{
        let c= await cartItem.userCart.find();
        res.send(c);
    }catch(error){
        return res.status(404).send(error.message);
    }
});

router.post('/cartByUser', async(req,res) => {
    try{
       console.log(req.body);
        let c= await cartItem.userCart.find({"userEmail":req.body.userEmail});
          // console.log(c);
        // if(c==null){ return res.status(404).send({message:"Empty cart...."})};
        res.send(c); 
    }
    catch(error){
        return res.status(404).send(error.message);
    }
});

router.delete('/removeCartItem/:id', async(req,res) => {
    try{
        let d= await cartItem.userCart.findByIdAndDelete(req.params.id);
        if(!d){return res.status(404).send({message:"Item not Found..."})};

        console.log(d);

        res.send({message:"Item deleted Successfully....",data: d});
    }
    catch(error){
        return res.status(404).send(error.message);
    }
});

router.put('/updateCart/:id', async(req,res)=> {
    try {

        console.log(req.body);
        // console.log(req.body.quantity);
    //    console.log(req.params);

        
        let cartId= await cartItem.userCart.findById(req.params.id);
        console.log(cartId);
        if(!cartId){return res.status(404).send({message:"item not in cart"})};


        cartId.cartItems.quantity= req.body.quantity
        cartId.cartItems.totalPrice = cartId.cartItems.offerPrice * cartId.cartItems.quantity;
        cartId.cartItems.updateDate= Date.now();

        
        // let data= new cartItem.cartItem({
        //     productId: p._id,
        //     name: p.name,
        //     image: p.image,
        //     offerPrice : p.offerPrice,
        //     price: p.price,
        //     quantity: req.body.quantity,
        //     totalPrice: (p.offerPrice*req.body.quantity)
        //     // recordDate:{type:Date,default:Date.now},
        //     // updateDate:{type:Date,default:Date.now} 
        // });




        // let c= await cartId.save();
        console.log(cartId);
        await cartId.save();
        res.send(cartId);
    }
    catch(error){
        console.log(error.message);
        return res.status(404).send(error.message);
    }
});

module.exports = router;