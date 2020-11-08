let express= require('express');
let router=express.Router();
let product= require('../schema/products');
let cat= require('../schema/categoryModel');
let subCat= require('../schema/subCategoryModel')

router.post('/addProduct', async(req,res)=> {
try{
    let{error}= await product.validateDate(req.body);
    if(error) {return res.status(404).send(error.details[0].message)};

    let category= await cat.categoryModel.findById(req.body.category);
    let subCategory= await subCat.subCatModel.findById(req.body.subCategory);

    let newProduct=new product.productModel({
        name: req.body.name,
        // image: req.body.image,
        description: req.body.description,
        price: req.body.price,
        offerPrice: req.body.offerPrice,
        isAvailable: req.body.isAvailable,
        isTodayOffer: req.body.isTodayOffer,
        category: category,
        subCategory: subCategory
    });

    let data= await newProduct.save();

    res.send({data: data})
}catch(error){
    return res.status(404).send(error.details[0].message);
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

router.delete('/removeProduct/:id', async(req,res)=> {
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

router.put('/updateProduct/:id', async(req,res)=> {
    try{
        

    }catch(error){
        return res.status(404).send(error.details[0].message);
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

//find Latest Product-------incomplete
router.get('/findLatestProducts', async(req,res)=> {
    try{

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