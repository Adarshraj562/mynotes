const express = require('express');
const PORT = process.env.PORT || 5000;
const app= express();
const connectDatabase = require('./database/db');
const rajRoutes = require('./Routes/Rajroutes');

const cors = require('cors');

app.use(cors());


app.use(express.json());

connectDatabase();

// Use the routes
app.use('/', rajRoutes);


//why cors is used== what happens if we don't use it?== 

app.listen(PORT,()=>{
    console.log(`server connected to http://localhost:${PORT}`);
})