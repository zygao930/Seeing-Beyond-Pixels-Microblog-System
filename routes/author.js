/**
 * author.js
 * This file handles routes and logic for managing content related to the author (administrator) of the blog/microblog.
 * It is used in a microblog hub for exploring Computer Vision workshops, techniques, and innovations.
 *
 * The routes are structured for:
 * - Viewing and managing blog settings
 * - Managing drafts, including creation, editing, publishing, and deletion of workshop drafts
 * - Managing published content, including deleting published workshops
 * - Viewing bookings for published workshops and their associated tickets
 *
 * Key functionalities:
 * - CRUD operations on blog settings and workshop drafts
 * - Managing ticket sales for workshops (VIP and General tickets)
 * - Viewing workshop bookings with detailed information
 * - Handling database queries using SQLite
 * 
 * The file uses `express` for routing and `global.db` for interacting with an SQLite database.
 */

const express = require("express");
const author = express.Router();
const { getFormattedTimestamp } = require("../utility/utility");
const Queries = require("../utility/queries");

// GET route to render the blog settings page
author.get('/setting', (req, res) => {
   // Query to fetch blog settings
   global.db.get(Queries.getBlogInfo, (err, blogResult) => {
      if (err) {
         console.error('Error with setting (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error with setting');
      }
      res.render('site-setting.ejs', {
         blog: blogResult,
      });
   });
});

// POST route to update the blog settings
author.post('/setting/:id', (req, res) => {
   const blogId = req.params.id;
   const { blog_title, blog_subtitle, blog_author } = req.body;

   // Update blog settings based on provided values
   global.db.run(Queries.updateBlogInfo, [blog_title, blog_subtitle, blog_author, blogId], function (err) {
      if (err) {
         console.error('Error with blog setting (SQLite):', err.message);
         return res.status(500).send('Error with blog setting');
      }
      // Redirect to settings page after successful update
      res.redirect('/author/setting');
   })
});

// GET route to show home page with drafts and published workshops
author.get('/home', (req, res) => {
   // Fetch all drafts
   global.db.all(Queries.getAllDrafts, (err, draftResult) => {
      if (err) {
         console.error(err);
      }
      // Fetch all published workshops
      global.db.all(Queries.getAllPublished, (err, publishedResult) => {
         if (err) {
            console.error(err);
         }
         // Fetch blog information
         global.db.get(Queries.getBlogInfo, (err, blogResult) => {
            if (err) {
               console.error('Error with homepage (SQLite):', err.message);  // Log SQLite error
               return res.status(500).send('Error with homepage');
            }
            // Render home page with fetched data
            res.render('author-home.ejs', {
               workshopDrafts: draftResult,
               workshopPublished: publishedResult,
               blog: blogResult,
            });
         });
      });
   });
});

// GET route to render the draft editing page
author.get('/draft-edit/:id', (req, res) => {
   const workshopId = req.params.id;

   // Fetch the specific draft to edit
   global.db.get(Queries.getDraftById, [workshopId], function (err, workshopResult) {
      if (err) {
         console.error('Error during editing draft (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error editing draft');
      }
      // Fetch tickets for the specific draft
      global.db.all(Queries.selectTicketById, [workshopId], function (err, ticketResult) {
         if (err) {
            console.error('Error during editing draft (SQLite):', err.message);  // Log SQLite error
            return res.status(500).send('Error editing draft');
         }

         // Fetch blog info for display
         global.db.get(Queries.getBlogInfo, (err, blogResult) => {
            if (err) {
               console.error('Error with homepage (SQLite):', err.message);  // Log SQLite error
               return res.status(500).send('Error with homepage');
            }
            // Render the draft edit page with fetched data
            res.render('draft-edit.ejs', {
               workshop: workshopResult,
               blog: blogResult,
               tickets: ticketResult
            });
         });
      });
   });
});

// POST route to update draft information and ticket data
author.post('/draft-edit/:id', (req, res) => {
   const workshopId = req.params.id;
   const { workshop_title, workshop_subtitle, workshop_description } = req.body;
   const formattedTimestamp = getFormattedTimestamp();

   // Update the draft information
   global.db.run(Queries.updateDraftById, [workshop_title, workshop_subtitle, workshop_description, formattedTimestamp, workshopId], function (err) {
      if (err) {
         console.error('Error during editing draft:', err.message);  
         return res.status(500).send('Error during editing draft');
      }

      const tickets = [];
      // Update tickets based on the form data
      for (let i = 0; i < req.body.tickets_type.length; i++) {
         tickets.push({
            tickets_type: req.body.tickets_type[i],
            tickets_number_available: req.body.tickets_number_available[i],
            tickets_price: req.body.tickets_price[i],
            tickets_id: req.body.tickets_id[i],
         });

         // Update each ticket in the database
         tickets.forEach((ticket, index) => {
            global.db.run(Queries.updateTicketById, [ticket.tickets_type, ticket.tickets_number_available, ticket.tickets_price, ticket.tickets_id], function (err) {
               if (err) {
                  console.error('Error during editing draft:', err.message);  
                  return res.status(500).send('Error during editing draft');
               }  
            });
         });      
      };
      // Redirect to home page after successful update
      res.redirect('/author/home');
  });
});

// POST route to publish a draft and move it to the published section
author.post('/draft-publish/:id', (req, res) => {
   const draftId = req.params.id;

   // Insert the draft into the published table
   global.db.run(Queries.insertIntoPublished, [draftId], function (err) {
       if (err) {
           console.error('Error during publishing (SQLite):', err.message);  // Log SQLite error
           return res.status(500).send('Error during publishing');
       }

       // Delete the draft from the drafts table after publishing
       global.db.run(Queries.deleteDraftById, [draftId], function (err) {
           if (err) {
               console.error('Error during deleting draft (SQLite):', err.message);  // Log SQLite error
               return res.status(500).send('Error deleting draft');
           }
           // Redirect to home page after publishing
           res.redirect('/author/home');
       });
   });
});

// POST route to delete a draft along with associated tickets
author.post('/draft-delete/:id', (req, res) => {
   const draftId = req.params.id;

   // First delete all associated tickets
   global.db.run(Queries.deleteTicketByDraftId, [draftId], function (err) {
      if (err) {
         console.error('Error during deleting tickets (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error deleting tickets');
      }

      // Then delete the draft (workshop)
      global.db.run(Queries.deleteDraftById, [draftId], function (err) {
         if (err) {
            console.error('Error during deleting draft (SQLite):', err.message);  // Log SQLite error
            return res.status(500).send('Error deleting draft');
         }
         // Redirect to home page after deletion
         res.redirect('/author/home');
      });
   });
});

// GET route to render the draft creation form
author.get('/draft-create', (req, res) => {
   global.db.get(Queries.getBlogInfo, (err, blogResult) => {
      if (err) {
         console.error('Error with homepage (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error with homepage');
      }
      // Render draft creation form
      res.render("draft-create.ejs", {
         blog: blogResult,
      });
   });
});

// POST route to create a new draft with tickets
author.post('/draft-create', (req, res) => {
   const formattedTimestamp = getFormattedTimestamp();
   const { workshop_code, workshop_title, workshop_subtitle, workshop_description, workshop_available_tickets, workshop_event_date, 
      VIP_tickets_number_available, VIP_tickets_price, General_tickets_number_available, General_tickets_price  } = req.body;

   // Insert a new draft into the database
   global.db.run(Queries.insertIntoDraft, [workshop_code, workshop_title, workshop_subtitle, workshop_description,
      formattedTimestamp, formattedTimestamp, workshop_available_tickets, workshop_event_date], function (err) {
      if (err) {
         console.error('Error during creating draft (SQLite):', err.message);  
         return res.status(500).send('Error creating draft');
      }
      const workshopId = this.lastID; // Get the last inserted ID for the workshop

      // Insert VIP tickets first
      global.db.run(Queries.insertVIPTickets, [VIP_tickets_number_available, VIP_tickets_price, workshopId], function (err) {
         if (err) {
            console.error('Error during creating VIP ticket (SQLite):', err.message);
            return res.status(500).send('Error creating VIP ticket');
         }
         // Insert General tickets
         global.db.run(Queries.insertGeneralTickets, [General_tickets_number_available, General_tickets_price, workshopId], function (err) {
            if (err) {
               console.error('Error during creating General ticket (SQLite):', err.message);
               return res.status(500).send('Error creating General ticket');
            }
            // Redirect to home page after successful creation
            res.redirect('/author/home');
         });
      });
   });
});

// POST route to delete a published workshop along with its tickets
author.post('/published-delete/:id', (req, res) => {
   const publishId = req.params.id;

   // First delete all associated tickets
   global.db.run(Queries.deleteTicketByDraftId, [publishId], function (err) {
      if (err) {
         console.error('Error during deleting tickets (SQLite):', err.message);  // Log SQLite error
         return res.status(500).send('Error deleting tickets');
      }

      // Then delete the published workshop
      global.db.run(Queries.deletePublishedById, [publishId], function (err) {
         if (err) {
            console.error('Error during deleting published (SQLite):', err.message);  // Log SQLite error
            return res.status(500).send('Error deleting published');
         }
         // Redirect to home page after successful deletion
         res.redirect('/author/home');
      });
   });
});

// GET route to fetch and display all bookings for published workshops
author.get('/booking', async (req, res) => {
   try {
       // Fetch only published workshops
       const publishedResult = await new Promise((resolve, reject) => {
           global.db.all('SELECT * FROM workshop WHERE workshop_status = "published"', (err, result) => {
               if (err) reject(err);
               resolve(result);
           });
       });

       // Fetch tickets for all workshops concurrently
       const ticketsPromises = publishedResult.map(workshop =>
           new Promise((resolve, reject) => {
               global.db.all(Queries.getticketsByTicketWorkshopId, [workshop.workshop_id], (err, result) => {
                   if (err) reject(err);
                   resolve({ workshopId: workshop.workshop_id, workshopTitle: workshop.workshop_title, workshopEventDate: workshop.workshop_event_date, tickets: result });
               });
           })
       );

       const ticketsResults = await Promise.all(ticketsPromises);

       // Fetch bookings for all tickets concurrently
       const bookingsPromises = ticketsResults.map(ticketData => 
           ticketData.tickets.map(ticket =>
               new Promise((resolve, reject) => {
                   global.db.all(Queries.getBookingsByBookedTicketsId, [ticket.tickets_id], (err, result) => {
                       if (err) reject(err);
                       resolve({ ticketId: ticket.tickets_id, bookings: result });
                   });
               })
           )
       ).flat(); // Flatten the array of promises into a single array

       const bookingsResults = await Promise.all(bookingsPromises);

       // Fetch the blog info
       const blogResult = await new Promise((resolve, reject) => {
           global.db.get('SELECT * FROM blog_info', (err, result) => {
               if (err) reject(err);
               resolve(result);
           });
       });

       // Combine all data into a single array for rendering
       const allBookings = ticketsResults.map(ticketData => ({
           workshopId: ticketData.workshopId,
           workshopTitle: ticketData.workshopTitle,
           workshopEventDate: ticketData.workshopEventDate,
           tickets: ticketData.tickets.map(ticket => ({
               ticketId: ticket.tickets_id,
               ticketsType: ticket.tickets_type,
               bookings: bookingsResults.filter(booking => booking.ticketId === ticket.tickets_id).flatMap(booking => booking.bookings),
           }))
       }));

       // Render the page with the combined data
       res.render('booking.ejs', {
           bookings: allBookings,
           blog: blogResult
       });

   } catch (err) {
       console.error("Error fetching data:", err);
       res.status(500).send("Error fetching data");
   }
});

// Export the router object so index.js can access it
module.exports = author;
