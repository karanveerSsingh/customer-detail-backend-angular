
// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/customer-details-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));
  // mongoose
  // .connect("mongodb+srv://atx-code:c5faguzsQGHtIWOR@atx05.8i3eeh7.mongodb.net/customerdb", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  // .then(() => console.log("✅ MongoDB Connected"))
  // .catch((err) => console.log(err));

// Model
const Customer = mongoose.model("Customer", {
  customerName: String,
  customerPhone: String,
  vehicleName: String,
  vehicleNumber: String,
  vehicleChassis: String,
  vehicleEngineNumber: String,
  bankName: String,
  totalFee: Number,
  paidAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// CRUD Routes
app.get("/api/customers", async (req, res) => {
  const customers = await Customer.find();
  res.json({ data: customers });
});

app.get("/api/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching customer" });
  }
});

app.post("/api/customers", async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.json({ data: customer }); // ✅ Fixed: customer instead of customers
});

app.put("/api/customers/:id", async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ data: customer }); // ✅ Fixed: customer instead of customers
});

app.delete("/api/customers/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

app.get("/api/customers/search/:key", async (req, res) => {
  const key = req.params.key;
  try {
    const customers = await Customer.find({
      $or: [
        { customerName: { $regex: key, $options: "i" } },
        { vehicleName: { $regex: key, $options: "i" } },
      ],
    });
    res.json({ data: customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
});

app.post("/api/customers/:id/pay", async (req, res) => {
  const { amount } = req.body;
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.paidAmount += amount;
    await customer.save();
    res.json({ data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment failed" });
  }
});

// Monthly customer count route
app.get("/api/customers/count/monthly", async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  try {
    const count = await Customer.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching monthly count" });
  }
});


// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Server running on http://localhost:3000/'); // ✅ Fixed port
});

