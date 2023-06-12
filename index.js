const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// Connection URI Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xeq99py.mongodb.net/`;

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  await client.connect();

  const servicesCategories = client.db('products').collection('categories');
  const servicesProducts = client.db('products').collection('product');
  const usersCollection = client.db('products').collection('usersCollection');

  // GET categories
  app.get('/categories', async (req, res) => {
    const categories = await servicesCategories.find({}).toArray();
    res.json(categories);

  });

  // Get all products
  app.get('/products', async (req, res) => {
    const products = await servicesProducts.find({}).toArray();
    res.json(products);

  });

  // Get product by category title
  app.get('/products/:title', async (req, res) => {
    const { title } = req.params;
    const query = { title };
    const products = await servicesProducts.find(query).toArray();
    res.json(products);

  });

  // Get product data by id
  app.get('/products/product/:id', async (req, res) => {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };
    const result = await servicesProducts.findOne(query);

    res.json(result);

  });

  // Delete categories by id
  app.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const result = await servicesCategories.deleteOne(filter);
    res.json({ message: 'Category deleted successfully' });

  });

  // Add Categories
  app.post('/categories', async (req, res) => {
    const categorie = req.body;
    const result = await servicesCategories.insertOne(categorie);
    res.json({ message: 'Category added successfully' });

  });

  // Delete product by id
  app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const result = await servicesProducts.deleteOne(filter);
    res.json({ message: 'Product deleted successfully' });

  });

  // Add Product
  app.post('/products', async (req, res) => {
    const product = req.body;
    const result = await servicesProducts.insertOne(product);
    res.json({ message: 'Product added successfully' });

  });

  // Admin
  app.get('/users', async (req, res) => {
    const users = await usersCollection.find({}).toArray();
    res.json(users);

  });

  app.post('/users', async (req, res) => {
    const users = req.body;
    const result = await usersCollection.insertOne(users);
    res.json({ message: 'User added successfully' });

  });

  app.get('/users/admin/:email', async (req, res) => {
    const { email } = req.params;
    const query = { email };
    const user = await usersCollection.findOne(query);
    res.json({ isAdmin: user?.isAdmin === 'admin' });

  });
}

run().catch(console.error);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});