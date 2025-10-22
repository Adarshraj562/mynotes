const mongoose = require('mongoose');

async function connectDatabase() {
    try {
        await mongoose.connect("mongodb+srv://rajuser:ZUZDXY0ZrxRWSmp7@cluster0.hqyrjtz.mongodb.net/Practice?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

module.exports = connectDatabase;