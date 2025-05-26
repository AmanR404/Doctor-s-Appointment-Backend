import express from 'express'
const app = express()
const port = 3000
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv';
dotenv.config();

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Database Connection
import { MongoClient } from 'mongodb'
const url = process.env.DATABASE_URL
const client = new MongoClient(url)

const dbName = "physionic"
client.connect()

// Endpoints
app.get('/patientname',async(req, res) => {
  try{
    const db = client.db(dbName)
    const collection = db.collection('patients');
    const patient = await collection.find({}).toArray();
    res.send(patient[0])
  }
  catch(err) {
    console.error('Error fetching patient name:', err);
  }
})

// Endpoint to get all Appointments
app.get('/myappointments',async(req,res) => {
  try{
      const response = await fetch('http://localhost:3000/patientname')
      let result = await response.json();
      const db = client.db(dbName)
      const collection = db.collection('appointments')
      const appointments = await collection.find({name : result.firstname + " " + result.lastname }).toArray()
      res.send(appointments);
  }
  catch(err) {
      console.error('Error fetching appointments:', err);
      res.status(500).send({error: 'Failed to fetch appointments'});
  }
})

// Endpoint to post Patients Data
app.post('/patients',async(req,res) => {
    try{
      const db = client.db(dbName);
      const collection = db.collection('patients');
      const insertResult = await collection.insertOne(req.body);
      res.send({success: true, result: insertResult});
    }
    catch(err) {
      console.error('Error posting patient data:', err);
      res.status(500).send({error: 'Failed to post patient data'});
    }
})

// Endpoint to post/Create Appointment
app.post('/appointments',async(req,res) => {
   try{
      const db = client.db(dbName);
      const collection = db.collection('appointments');
      const insertResult = await collection.insertOne(req.body);
      res.send({success: true, result: insertResult});
   }
   catch(err) {
      console.error('Error Creating Appointment:', err);
      res.status(500).send({error: 'Failed to Create an Appointment'});
   }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
