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

async function run() {
  try {
    client.connect();

    const servicesCategories = client.db('products').collection('categories');
    const servicesProducts = client.db('products').collection('product');
    const usersCollection = client.db('products').collection('usersCollection');

    // GET categories
    app.get('/categories', async (req, res) => {
      try {
        const categories = await servicesCategories.find({}).toArray();
        res.json(categories);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get all products
    app.get('/products', async (req, res) => {
      try {
        const products = await servicesProducts.find({}).toArray();
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get product by category title
    app.get('/products/:title', async (req, res) => {
      try {
        const { title } = req.params;
        const query = { title };
        const products = await servicesProducts.find(query).toArray();
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Get product data by id
    app.get('/products/product/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await servicesProducts.findOne(query);

        res.json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Delete categories by id
    app.delete('/categories/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        const result = await servicesCategories.deleteOne(filter);
        res.json({ message: 'Category deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Add Categories
    app.post('/categories', async (req, res) => {
      try {
        const categorie = req.body;
        const result = await servicesCategories.insertOne(categorie);
        res.json({ message: 'Category added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Delete product by id
    app.delete('/products/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const filter = { _id: new ObjectId(id) };
        const result = await servicesProducts.deleteOne(filter);
        res.json({ message: 'Product deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Add Product
    app.post('/products', async (req, res) => {
      try {
        const product = req.body;
        const result = await servicesProducts.insertOne(product);
        res.json({ message: 'Product added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Admin
    app.get('/users', async (req, res) => {
      try {
        const users = await usersCollection.find({}).toArray();
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/users', async (req, res) => {
      try {
        const users = req.body;
        const result = await usersCollection.insertOne(users);
        res.json({ message: 'User added successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/users/admin/:email', async (req, res) => {
      try {
        const { email } = req.params;
        const query = { email };
        const user = await usersCollection.findOne(query);
        res.json({ isAdmin: user?.isAdmin === 'admin' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.error);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});