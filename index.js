const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();


// Connection URI Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cegkufg.mongodb.net/`;
// const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    const servicesCategories = client.db('products').collection('categories');
    const servicesProducts = client.db('products').collection('product');
    const usersCollection = client.db('products').collection('usersCollection');

    // GET categories
    app.get('/categories', async (req, res) => {
      const query = {}
      const cursor = servicesCategories.find(query)
      const categories = await cursor.toArray()
      res.send(categories)
    })

    //Get all products
    app.get('/products', async (req, res) => {
      const query = {}
      const cursor = servicesProducts.find(query)
      const products = await cursor.toArray()
      res.send(products);
    })

    // //Get product by categorie title
    app.get('/products/:title', async (req, res) => {
      const title = req.params.title;
      const query = { 'title': title }
      const cursor = servicesProducts.find(query)
      const products = await cursor.toArray()
      res.send(products)
    })

    //Get product data by id
    app.get('/products/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesProducts.findOne(query);

      res.json(result);
    }) 

    //delete categories by id
    app.delete('/categories/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await servicesCategories.deleteOne(filter);
      res.send(result);
    })
    // Add Categories 
    app.post('/categories', async (req, res) => {
      const categorie = req.body;
      const result = await servicesCategories.insertOne(categorie);
      res.send(result);
    });

    //delete product by id
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await servicesProducts.deleteOne(filter);
      res.send(result);
    })
    // Add Product 
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await servicesProducts.insertOne(product);
      res.send(result);
    });

    // Admin
    app.get('/users', async (req, res) => {
      const users = {}
      const collection = usersCollection.find(users);
      const result = await collection.toArray()
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.isAdmin === 'admin' });
    })



  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}

run().catch(console.error);


//Get product data by categorie id
// app.get('/products/:id', (req, res ) => {
//   const id = req.params.id;
//   const selectedProduct = products.filter(p => p.categorie_id == id)
//   res.send(selectedProduct)
// });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})