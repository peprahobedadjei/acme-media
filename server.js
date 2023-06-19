const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const payments = [];

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/api/checkout', (req, res) => {
  const payment = req.body;
  payments.push(payment);
  //I can perform additional validation or store the payment information in a database here
  res.sendStatus(200);
});

app.get('/api/payments', (req, res) => {
  res.json(payments);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
