const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser =require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 5500

app.use(cors());
app.use(bodyParser.json());

console.log(process.env.DB_USER)
app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhl9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err',err)
 
    const productCollection = client.db("gadget").collection("products");
    const orderCollection = client.db("gadget").collection("orders");
  
  app.get('/products',(req,res)=>{
    productCollection.find()
    .toArray((err,products) => {
      res.send(products)
    })
  })

 

   
  app.get('/product/:id',(req,res)=>{
  productCollection.find({_id:req.params.id})
    .toArray((err,products) => {
      res.send(products[0]);
      console.log(products[0])
     
    })
  })
 
  app.post('/addProduct',(req,res) => {
    const newProduct = req.body;
    console.log('adding new product:',newProduct)
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('insertedCount',result.insertedCount);
      res.send(result.insertedCount > 0)

    })

  })
  app.get("/orders",(req,res)=>{
    orderCollection.find()
    .toArray((err,products) => {
      res.send(products)
    })
  
  })
 
  app.post('/addOrder',(req,res) => {
    const newOrder = req.body;
    console.log('adding new order:',newOrder)
    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('insertedCount',result.insertedCount);
      res.send(result.insertedCount > 0)

    })

  })
  app.get("/order/",(req,res)=>{
    orderCollection.find({email:req.query}).toArray((err,orders)=>{
      res.send(orders);
    })
  })

  
//   client.close();
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})