/**
 * Author Home Route
 * 
 * This route handles the author's homepage and retrieves the blog's information
 * from the database. It queries the database for the blog details and renders 
 * the home page view ('home.ejs') with the fetched blog data. If there is any 
 * error while fetching the data, an error message is sent to the client.
 */

// Import necessary modules
const express = require("express");
const home = express.Router();
const Queries = require("../utility/queries");

// Define the route to serve the homepage
home.get('/', (req, res) => {
   // Query the database for blog information
   global.db.get(Queries.getBlogInfo, (err, blogResult) => {
      // Error handling for database query
      if (err) {
         console.error('Error with setting (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error with setting');  // Respond with a 500 error
      }

      // Render the 'home.ejs' template and pass the blog data to it
      res.render('home.ejs', {
         blog: blogResult,  // Pass the blog data fetched from the database
      });
   });
});

// Export the home router to be used in the main app
module.exports = home;
