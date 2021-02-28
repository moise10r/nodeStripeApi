const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');
const morgan = require('morgan')

const app = express();
const PORT = process.env.PORT || 1111;


app.engine('handlebars',exphbs({
    defaultLayout:'main'
}))
app.set('view engine','handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan('dev'))
//set the static folder
app.use(express.static(path.join(__dirname,'public')))
app.get('/',(req,res)=>{
    res.render('index',{
        stripePublishableKey:keys.stripePublishableKey
    })
})
app.post('/charge',(req,res)=>{
    const amount = 2500;
   stripe.customers.create({
       email:req.body.stripeEmail,
       source:req.body.stripeToken
   }).then(customer => stripe.charges.create({
       amount,
       description:'Web Development Ebook',
       currency:'usd',
       customer:customer.id
   }))
   .then(charge => res.render('success'));
})
app.listen(PORT,(req,res)=>{
    console.log(`The server started on Port ${chalk.red(PORT)}`)
})