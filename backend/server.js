import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


app.use(cors());
app.use(express.json()); 


mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/users', async (req, res) => { 
 try { 
 const user = new User(req.body); 
 const result = await user.save(); 
 res.status(201).json(result); 
 } catch (err) { 
 res.status(400).json({ error: err.message }); 
 } 
});


app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
