let morgan=require('morgan');
let express= require('express');

let user= require('../routers/userRegistration');
let login= require('../routers/userLogin');
let contact= require('../routers/contacts');
let category= require('../routers/category');
let subCategory= require('../routers/subCategory');
let product= require('../routers/product');


module.exports = (app) => {
    app.use(morgan('tiny'));
    app.use(express.json());

    app.use('/api/', user);
    app.use('/api/', login);
    app.use('/api/',contact);
    app.use('/api/',category);
    app.use('/api/',subCategory);
    app.use('/api/',product);
}