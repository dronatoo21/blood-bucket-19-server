const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    // --------------------------------
    // collections--------------------------------
    // --------------------------------

    const districtsCollection = client.db("bloodDb").collection("districts");
    const upazilasCollection = client.db("bloodDb").collection("upazilas");
    const userCollection = client.db("bloodDb").collection("users");
    const donationCollection = client.db("bloodDb").collection("donations");
    const blogCollection = client.db("bloodDb").collection("blogs");

    // --------------------------------
    // locations--------------------------------
    // --------------------------------

    app.get('/districts', async (req, res) => {
        const result = await districtsCollection.find().toArray();
        res.send(result); 
      })
    app.get('/upazilas', async (req, res) => {
        const result = await upazilasCollection.find().toArray();
        res.send(result); 
      })

      // --------------------------------
      // blogs --------------------------------
      // --------------------------------

      app.post('/blogs', async(req, res)=>{
        const newBlog = req.body;
        const result = await blogCollection.insertOne(newBlog)
        res.send(result)
      })

      app.get('/blogs/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await blogCollection.findOne(query)
        res.send(result);
      })

      app.get('/blogs', async (req, res) => {
        const result = await blogCollection.find().toArray();
        res.send(result); 
      })
      app.get('/blog', async (req, res) => {
        const result = await blogCollection.find().toArray();
        res.send(result); 
      })

      app.delete('/blogs/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await blogCollection.deleteOne(query);
        res.send(result)
      })

      app.patch('/blogs/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            blogStatus: 'published',
          }}
        const result = await blogCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

      app.patch('/blog/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            blogStatus: 'draft',
          }}
        const result = await blogCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

      app.put('/blogs/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = {upsert: true}
        const updatedData = req.body
        const blogData = {
          $set: {
            title: updatedData.title,
            thumbnail: updatedData.thumbnail,
            BlogContent: updatedData.BlogContent,
            blogStatus: updatedData.blogStatus
          }}
        const result = await blogCollection.updateOne(filter, blogData, options)
        res.send(result)
      })

      // --------------------------------
      // roles --------------------------------
      // --------------------------------

      app.get('/makeAdmin/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.findOne(query)
        res.send(result);
      })

      app.patch('/makeAdmin/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            role: 'admin',
          }}
        const result = await userCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

      app.get('/makeVol/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.findOne(query)
        res.send(result);
      })

      app.patch('/makeVol/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            role: 'volunteer',
          }}
        const result = await userCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

      // --------------------------------
      // donations --------------------------------
      // --------------------------------

      app.post('/donations', async(req, res)=>{
        const newDonation = req.body;
        const result = await donationCollection.insertOne(newDonation)
        res.send(result)
      })

      app.get('/donations/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await donationCollection.findOne(query)
        res.send(result);
      })
      app.get('/donorC/donations/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await donationCollection.findOne(query)
        res.send(result);
      })

      app.get('/myDonation/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await donationCollection.findOne(query)
        res.send(result);
      })

      app.patch('/donorC/donations/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedData = req.body
        const options = {upsert: true}
        const UserData = {
          $set: {
            donorName: updatedData.donorName,
            donorEmail: updatedData.donorEmail,
            donationStatus: updatedData.donationStatus,
          }}
        const result = await donationCollection.updateOne(filter, UserData, options)
        res.send(result)
        console.log(updatedData, id);
      })

      app.patch('/myDonation/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedData = req.body
        const options = {upsert: true}
        const UserData = {
          $set: {
            donationStatus: updatedData.donationStatus,
            requesterName: updatedData.requesterName,
            requesterEmail: updatedData.requesterEmail,
            recipientName: updatedData.recipientName,
            fullAddress: updatedData.fullAddress,
            district: updatedData.district,
            upazila: updatedData.upazila,
            hospitalName: updatedData.hospitalName,
            donationDate: updatedData.donationDate,
            donationTime: updatedData.donationTime,
            bloodGroup: updatedData.bloodGroup,
            requestMessage: updatedData.requestMessage
          }}
        const result = await donationCollection.updateOne(filter, UserData, options)
        res.send(result)
        console.log(updatedData, id);
      })

      app.get('/donations', async (req, res) => {
        let query = {};
        if (req.query?.requesterEmail){
          query = { requesterEmail: req.query?.requesterEmail }
        }
        const result = await donationCollection.find(query).toArray();
        res.send(result); 
      })
      
      app.patch('/donations/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            donationStatus:'cancelled',
          }}
        const result = await donationCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

      app.patch('/myDonations/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            donationStatus:'done',
          }}
        const result = await donationCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

      app.delete('/MyDonations/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await donationCollection.deleteOne(query);
        res.send(result)
      })

      // --------------------------------
      // users --------------------------------
      // --------------------------------

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
        let query = {};
        if (req.query?.email){
          query = { email: req.query.email }
        }
        const result = await userCollection.find(query).toArray();
        res.send(result);
      })

      app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.findOne(query)
        res.send(result);
      })
      app.get('/allUsers/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.findOne(query)
        res.send(result);
      })

      app.put('/users/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = {upsert: true}
        const updatedData = req.body
        const UserData = {
          $set: {
            email: updatedData.email,
            name: updatedData.name,
            avater: updatedData.avater,
            bloodGroup: updatedData.bloodGroup,
            district: updatedData.district,
            upazila: updatedData.upazila,
            status: updatedData.status,
            role: updatedData.role 
          }}
        const result = await userCollection.updateOne(filter, UserData, options)
        res.send(result)
      })

      app.get('/users', async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result); 
      })

      app.patch('/users/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            status:'blocked',
          }}
        const result = await userCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })
      
      app.patch('/allUsers/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const updatedDoc = {
          $set: {
            status:'active',
          }}
        const result = await userCollection.updateOne(filter, updatedDoc)
        res.send(result)
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is runing')
})

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})