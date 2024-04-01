const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');


dotenv.config({ path: '../backend/.env' });


const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log("MongoDB URI:",process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const customerSchema = new mongoose.Schema({
    name :{ type:String,required:true },
    email:{ type:String,required:true },
    phone:{ type:String,required:true},
});

const adminSchema = new mongoose.Schema({
  name :{ type:String,required:true },
  email:{ type:String,required:true },
  phone:{ type:String,required:true},
  password:{ type:String,required:true},
});

const Customer = mongoose.model('customer',customerSchema);

const Admin = mongoose.model('admins',adminSchema);

app.post('/admins', async (req,res) => {
  const { name, email, phone,password } = req.body;
  
  try
  {
      const admin = await Admin.findOne({email});
      
      if(admin)
      {
          return res.status(400).json({ error: 'Admin Already Exists'});
      }
  
      const newAdmin = new Admin({ name, email, phone,password });
  
      await newAdmin.save();
      res.json({ message : 'Admin Registered' });
  }
  catch(error)
  {
      res.status(500).json({ error : 'Error On adding Admin'});
  }
  });


app.post('/customers', async (req,res) => {
const { name, email, phone } = req.body;

try
{
    const customer = await Customer.findOne({email});
    
    if(customer)
    {
        return res.status(400).json({ error: 'Customer Already Exists'});
    }

    const newCustomer = new Customer({ name, email, phone });

    await newCustomer.save();
    res.json({ message : 'Customer Added' });
}
catch(error)
{
    res.status(500).json({ error : 'Error On adding customer'});
}
});

app.get('/customers', async (req, res) => {
    try {
      const customers = await Customer.find();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving customers' });
    }
  });

  //Update customer by email
  app.put('/customers/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
      const updatedUser = req.body; // Assuming req.body contains the updated user object
  
      const customer = await Customer.findOneAndUpdate(
        { email },
        { $set: updatedUser },
        { new: true }
      );
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.json({ message: 'Customer updated successfully', customer });
    } catch (error) {
      res.status(500).json({ error: 'Error updating customer' });
    }
  });
  
  // Delete customer by email
  app.delete('/customers/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
      const customer = await Customer.findOneAndDelete({ email });
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.json({ message: 'Customer deleted successfully', customer });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting customer' });
    }
  });
  const port = process.env.PORT || 6000;
  app.listen(port, () => console.log(`Server running on PORT ${port}`));
