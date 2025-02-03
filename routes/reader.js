/**
 * Reader Routes
 * 
 * These routes handle the functionality for the reader's section of the website.
 * Fetches upcoming and past workshops and displays them along with blog details.
 * Retrieves a specific workshop's details and allows readers to book tickets.
 * Processes ticket bookings, inserts user and booking details into the database,
 * and updates ticket availability.
 * If any errors occur during these operations, appropriate error messages are logged and displayed.
 */

const express = require("express");
const reader = express.Router();
const { getFormattedTimestamp } = require("../utility/utility");
const Queries = require("../utility/queries");

// Route to handle the Reader's homepage
reader.get('/home', (req, res) => {

   // Fetch upcoming workshops from the database
   global.db.all(Queries.getPublishedUpcoming, (err, upcomingResult) => {
      if (err) {
         console.error(err);  // Log the error
      }
      // Fetch past workshops from the database
      global.db.all(Queries.getPublishedPast, (err, pastResult) => {
         if (err) {
            console.error(err);  // Log the error
         }
         // Fetch blog information from the database
         global.db.get(Queries.getBlogInfo, (err, blogResult) => {
            if (err) {
               console.error('Error with homepage (SQLite):', err.message);  // Log SQLite error
               return res.status(500).send('Error with homepage');
            }
            // Render the reader homepage with the fetched data
            res.render('reader-home.ejs', {
               workshopUpcoming: upcomingResult,  // List of upcoming workshops
               workshopPast: pastResult,  // List of past workshops
               blog: blogResult,  // Blog information
            });
         });
      });
   });
});

// Route to handle viewing and editing a specific workshop event
reader.get('/event/:id', (req, res) => {
   const workshopId = req.params.id;  // Get the workshop ID from the URL parameters

   // Fetch workshop details by its ID
   global.db.get(Queries.getPublishedById, [workshopId], function (err, workshopResult) {
      if (err) {
         console.error('Error during editing published (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error editing published');
      }
      // Fetch ticket details for the given workshop
      global.db.all(Queries.selectTicketById, [workshopId], function (err, ticketResult) {
         if (err) {
            console.error('Error during editing draft (SQLite):', err.message);  // Log SQLite error
            return res.status(500).send('Error editing draft');
         }

         // Fetch blog information to display on the event page
         global.db.get(Queries.getBlogInfo, (err, blogResult) => {
            if (err) {
               console.error('Error with published (SQLite):', err.message);  // Log SQLite error
               return res.status(500).send('Error with published');
            }

            // Render the event edit page with the workshop, ticket, and blog data
            res.render('event-edit.ejs', {
               workshop: workshopResult,  // Workshop details
               blog: blogResult,  // Blog information
               tickets: ticketResult  // List of available tickets for the event
            });
         });
      });
   });
});

// Route to handle the ticket booking process for an event
reader.post('/event/:id', (req, res) => {
   const { user_name, user_email, tickets_id, booked_tickets_tickets_number } = req.body;  // Extract user booking info from the request body
   const formattedTimestamp = getFormattedTimestamp();  // Get the current timestamp
  
   // Step 1: Insert the user data into the 'users' table
   global.db.run(Queries.createUser, [user_name, user_email], function (err) {
      if (err) {
         console.error('Error during creating user:', err.message);  // Log error
         return res.status(500).send('Error during creating user');
      }

      const user_id = this.lastID;  // Get the user_id of the newly created user

      // Step 2: Loop through each ticket and insert the booking
      let completedBookings = 0;  // Counter to track when all bookings are done

      tickets_id.forEach((ticket_id, index) => {
         const ticket_count = parseInt(booked_tickets_tickets_number[index], 10);  // Get the number of tickets booked for this ticket type

         // Step 2.1: Insert each ticket booking into the 'booked_tickets' table
         global.db.run(Queries.createBookedTickets, [user_id, ticket_id, ticket_count, formattedTimestamp], function (err) {
            if (err) {
               console.error('Error during creating ticket:', err.message);  // Log error
               return res.status(500).send('Error during creating ticket');
            }

            // Step 2.2: Update the available ticket count in the 'tickets' table
            global.db.run(Queries.updateTicketCounts, [ticket_count, ticket_id], function (err) {
               if (err) {
                  console.error('Error during updating ticket count:', err.message);  // Log error
                  return res.status(500).send('Error during updating ticket count');
               }

               completedBookings++;  // Increment the completed bookings counter

               // After processing all bookings, redirect the user to the homepage
               if (completedBookings === tickets_id.length) {
                  res.redirect('/reader/home');
               }
            });
         });
      });
   });
});

// Export the router object so index.js can access it
module.exports = reader;
