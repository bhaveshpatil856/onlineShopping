let morgan=require('morgan');
let express= require('express');

let user= require('../routers/userRegistration')

module.exports = (app) => {
    app.use(morgan('tiny'));
    app.use(express.json());

    app.use('/api/', user)
}