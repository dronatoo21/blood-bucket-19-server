const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcccoqk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const districtsCollection = client.db("bloodDb").collection("districts");
    const upazilasCollection = client.db("bloodDb").collection("upazilas");
    const userCollection = client.db("bloodDb").collection("users");

    app.get('/districts', async (req, res) => {
        const result = await districtsCollection.find().toArray();
        res.send(result); 
      })
    app.get('/upazilas', async (req, res) => {
        const result = await upazilasCollection.find().toArray();
        res.send(result); 
      })

      app.post('/user', async (req, res) => {
        const userInfo = req.body;
        const query = {email: userInfo.email}
        const existingUser = await userCollection.findOne(query);
        if(existingUser){
          return res.send({message: 'user already exists', insertedId: null})
        }
        const result = await userCollection.insertOne(userInfo)
        res.send(result);
      })

      app.get('/users', async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result); 
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})
