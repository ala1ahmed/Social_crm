const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const app = express();

//connect DB
connectDB();

//Init Middelware
app.use(express.json({ extended: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API is Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/company', require('./routes/api/company'));
app.use('/api/auth', require('./routes/api/auth'));
//app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
