let morgan=require('morgan');
let express= require('express');

let user= require('../routers/userRegistration');
let login= require('../routers/userLogin');

module.exports = (app) => {
    app.use(morgan('tiny'));
    app.use(express.json());

    app.use('/api/', user);
    app.use('/api/', login);
}