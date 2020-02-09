const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/products')

mongoose.connect(
    'mongodb+srv://GeoffeyMongo:' +
     process.env.MONGO_ATLAS_PW +
    '@node-rest-api-or2of.mongodb.net/test?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'Options'){
        res.header('Access-Control-Allow-Header', 'PUT, PSOT, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next()
})

app.use('/products', productRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error ,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;