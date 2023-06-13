const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://otmsbd.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Connection URI Mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xeq99py.mongodb.net/`;

// Create a new MongoClient
const client = new MongoClient(uri);

function run() {
  try {
    client.connect();

    const servicesCategories = client.db('products').collection('categories');
    const servicesProducts = client.db('products').collection('product');
    const usersCollection = client.db('products').collection('usersCollection');

    // GET categories
    app.get('/categories', (req, res) => {
      const categories = servicesCategories.find({}).toArray();
      res.json(categories);

    });

    // Get all products
    app.get('/products', (req, res) => {
      const products = servicesProducts.find({}).toArray();
      res.json(products);

    });

    // Get product by category title
    app.get('/products/:title', (req, res) => {
      const { title } = req.params;
      const query = { title };
      const products = servicesProducts.find(query).toArray();
      res.json(products);

    });

    // Get product data by id
    app.get('/products/product/:id', (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = servicesProducts.findOne(query);

      res.json(result);

    });

    // Delete categories by id
    app.delete('/categories/:id', (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const result = servicesCategories.deleteOne(filter);
      res.json({ message: 'Category deleted successfully' });

    });

    // Add Categories
    app.post('/categories', (req, res) => {
      const categorie = req.body;
      const result = servicesCategories.insertOne(categorie);
      res.json({ message: 'Category added successfully' });

    });

    // Delete product by id
    app.delete('/products/:id', (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const result = servicesProducts.deleteOne(filter);
      res.json({ message: 'Product deleted successfully' });

    });

    // Add Product
    app.post('/products', (req, res) => {
      const product = req.body;
      const result = servicesProducts.insertOne(product);
      res.json({ message: 'Product added successfully' });

    });

    // Admin
    app.get('/users', (req, res) => {
      const users = usersCollection.find({}).toArray();
      res.json(users);

    });

    app.post('/users', (req, res) => {
      const users = req.body;
      const result = usersCollection.insertOne(users);
      res.json({ message: 'User added successfully' });

    });

    app.get('/users/admin/:email', (req, res) => {
      const { email } = req.params;
      const query = { email };
      const user = usersCollection.findOne(query);
      res.json({ isAdmin: user?.isAdmin === 'admin' });

    });
  } catch (error) {
    console.error(error);
  }
}
run();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});