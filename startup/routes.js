let morgan=require('morgan');
let express= require('express');

let user= require('../routers/userRegistration');
let login= require('../routers/userLogin');
let contact= require('../routers/contacts');
let category= require('../routers/category');
let subCategory= require('../routers/subCategory');
let product= require('../routers/product');
let nodemailer= require('../routers/nodemailer');
let forgetPassword= require('../routers/forgetPasswordMailer');
let resetPassword=require("../routers/resetPassword");


module.exports = (app) => {
    app.use(morgan('tiny'));
    app.use(express.json());

    app.use('/api/', user);
    app.use('/api/', login);
    app.use('/api/',contact);
    app.use('/api/',category);
    app.use('/api/',subCategory);
    app.use('/api/',product);
    app.use('/api/',nodemailer);
    app.use('/api/',forgetPassword);
    app.use("/api/",resetPassword);
}