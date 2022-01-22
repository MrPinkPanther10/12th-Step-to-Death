// Required Modules
const db = require('./db/connection');
const express = require('express');
const cTable = require('console.table');

// Create server application at port 3001
const PORT = process.env.PORT || 3001;
const app = express();

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});