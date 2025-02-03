/**
 * index.js
 * This is the main entry point for the application, where the Express app is set up
 * and routes, middleware, and database connections are configured.
 */

// Import necessary modules
const express = require('express'); 
const app = express(); 
const port = 3000; 
var bodyParser = require("body-parser"); 

// Configure Express to use EJS for templating
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public')); 

// Set up SQLite database connection
const sqlite3 = require('sqlite3').verbose(); 
global.db = new sqlite3.Database('./database.db', function(err) {
    if (err) {
        console.error(err); 
        process.exit(1); 
    } else {
        console.log("Database connected"); 
        global.db.run("PRAGMA foreign_keys=ON"); 
    }
});

// Set up routes for different parts of the application
const homeRoutes = require('./routes/home'); // Import home routes from the home.js file
app.use('/', homeRoutes); // Use the home routes at the root path

const authorRoutes = require('./routes/author'); // Import author routes from the author.js file
app.use('/author', authorRoutes); // Use the author routes for paths starting with '/author'

const readerRoutes = require('./routes/reader'); // Import reader routes from the reader.js file
app.use('/reader', readerRoutes); // Use the reader routes for paths starting with '/reader'

// Start the web application and listen for incoming HTTP requests on the specified port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`); 
});
