let express= require('express');
let router=express.Router();
let product= require('../schema/products');
let cat= require('../schema/categoryModel');
let subCat= require('../schema/subCategoryModel');
let multer= require('multer');
let Auth= require('../middleware/auth');
let Admin= require('../middleware/isAdmin');


let port="http://localhost:4800";

let storage= multer.diskStorage({
    destination: function(req,image,cb) {
        cb(null, './images/');        
    },
    filename: function(req,image,cb){
        cb(null, image.originalname);        
    }
});

let fileFilter= function(req,image,cb){
    if(image.mimetype == "image/jpg" || image.mimetype == "image/png" || image.mimetype == "image/jpeg" || image.mimetype == "image/gif" || image.mimetype == "image/apng")
    {
        cb(null,true);
    }
    else{
        cb(null,false);
    }
};

let uploads= multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
});



router.post('/addProduct' , uploads.single('image') , async(req,res)=> {   
try{
    let{error}= await product.validateDate(req.body);
    if(error) {return res.status(404).send(error.details[0].message)};

    let p= await product.productModel.findOne({"name":req.body.name});
    if(p){ return res.status(404).send({message:"product already present. go to updateProduct to update Product.." })}

    let category= await cat.categoryModel.findById(req.body.category);
    if(!category){return res.status(404).send({message:"Invalid Category..."})};

    let subCategory= await subCat.subCatModel.findById(req.body.subCategory);
    if(!subCategory){return res.status(404).send({message:"Invalid SubCategory..."})};

    // console.log(req.file.filename);

    let newProduct=new product.productModel({
        name: req.body.name,
        image: port + '/images/' + req.file.filename,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        offerPrice: req.body.offerPrice,
        isAvailable: req.body.isAvailable,
        isTodayOffer: req.body.isTodayOffer,
        category: category,
        subCategory: subCategory
    });

    let data= await newProduct.save();

    res.send({data: data})
}
catch(error){
    return res.status(404).send(error.message);
}
});

router.get('/allProducts', async(req,res) => {
    let data= await product.productModel.find()
                                        .select('-__v');
    res.send({data: data});
});

router.get('/findProductById/:id', async(req,res)=> {
    // let {error}= await product.validateDate(req.body)

   try{ let productId= await product.productModel.findById(req.params.id);
    if(!productId) {return res.status(404).send({message:"product not found"})};

    res.send(productId);
    }
    catch(e)
    {
        return res.status(404).send(e.message);
    }
    
});

router.delete('/removeProduct/:id', [Auth,Admin], async(req,res)=> {
    try{ 
        let productId= await product.productModel.findByIdAndDelete(req.params.id);
        if(!productId) {return res.status(404).send({message:"product not found"})};
    
        res.send({message:"product removed Successfully...", data: productId});
    }
    catch(e)
    {
        return res.status(404).send(e.message);
    }
});

router.put('/updateProduct/:id', [Auth,Admin], uploads.single('image'), async(req,res)=> {
    try{
        let p= await product.productModel.findById(req.params.id);
        if(!p){return res.status(404).send({message:"product not found"})};

        p.name= req.body.name || p.name,
        p.image= port + '/images/' + req.file.filename || p.image,
        p.description= req.body.description || p.description,
        p.price= req.body.price || p.price,
        p.offerPrice= req.body.offerPrice || p.offerPrice,
        p.isAvailable= req.body.isAvailable || p.isAvailable,
        p.isTodayOffer= req.body.isTodayOffer || p.isTodayOffer,
        // p.category= category,
        // p.subCategory= subCategory
        p.updateDate= Date.now();

        await p.save();
        res.send(p);


    }catch(error){
        return res.status(404).send(error.message);
    }
});

router.get('/findTodayOffers', async(req,res)=> {
    try{
        let data=await product.productModel.find({isTodayOffer:true});

        res.send(data);

    }catch(error){
        return res.status(404).send(error.details[0].message)
    }
});

router.get('/findLatestProducts', async(req,res)=> {
    try{
        let data= await product.productModel.find()
                                            .sort({recordDate:-1})
                                            .exec();

        res.send(data);

    }catch(error){
        return  res.status(404).send(error.details[0].message);
    }
})

router.get('/productPageIndex/:page',async(req,res)=>{
    try{
        let perPage= 2;
        let currentpage= req.params.page || 1 ;
        let data= await product.productModel.find()
                                        .select('-__v')
                                        .skip((perPage*currentpage)-perPage)
                                        .limit(perPage);
                                        
        let totalCount= await product.productModel.find().count();
        let totalPages= Math.ceil(totalCount/perPage);

        res.send({
            data: data,
            currentpage: currentpage,
            totalPages: totalPages
        });
    }catch(error){
        return res.status(404).send(error.message);
    } 
});

router.get('/category/:catId/pageIndex/:page', async(req,res)=> {
    try {
        let perPage= 2;
        let currentpage = req.params.page || 1 ;
        let c= await cat.categoryModel.findById(req.params.catId);

        let data= await product.productModel.find({"category.categoryName": c.categoryName})
                                            .select("-__v")
                                            .skip((currentpage*perPage)-perPage)
                                            .limit(perPage);

        let totalCount= await product.productModel.find({"category.categoryName": c.categoryName}).count();
        let totalPages= Math.ceil(totalCount/perPage);
 
        res.send({
            data: data,
            currentPage: currentpage,
            totalPages: totalPages
        });
    } 
    catch(error){
        return res.status(404).send(error.details[0].message);
    }
});

router.get('/category/:catId/subCategory/:subCatId/pageIndex/:page', async(req,res)=> {
    try {
        let perPage= 2;
        let currentpage = req.params.page || 1 ;
        let c= await cat.categoryModel.findById(req.params.catId);
        let sCat= await subCat.subCatModel.findById(req.params.subCatId);

        let data= await product.productModel.find({"category.categoryName": c.categoryName,"subCategory.name":sCat.name})
                                            .select("-__v")
                                            .skip((currentpage*perPage)-perPage)
                                            .limit(perPage);

        let totalCount= await product.productModel.find({"category.categoryName": c.categoryName,"subCategory.name":sCat.name}).count();
        let totalPages= Math.ceil(totalCount/perPage);
 
        res.send({
            data: data,
            currentPage: currentpage,
            totalPages: totalPages
        });
    } 
    catch(error){
        return res.status(404).send(error.details[0].message);
    }
});

module.exports= router;