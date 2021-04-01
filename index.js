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

  app.get('/products',(req,res)=>{
    productCollection.find()
    .toArray((err,products) => {
      res.send(products)
      

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
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})