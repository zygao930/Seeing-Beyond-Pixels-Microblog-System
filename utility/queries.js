const Queries = {
  // Blog Info Queries
  // Fetches blog information from the blog_info table
  getBlogInfo: `
    SELECT * 
    FROM blog_info;
  `,
  // Updates the blog information in the blog_info table based on the blog_id
  updateBlogInfo: `
    UPDATE blog_info
    SET blog_title = ?, blog_subtitle = ?, blog_author = ?
    WHERE blog_id = ?;
  `,

  // Workshop Published Queries
  // Retrieves all workshops with a 'published' status
  getAllPublished: `
    SELECT * FROM workshop
    WHERE workshop_status = 'published';
  `,
  // Retrieves upcoming published workshops (events in the future)
  getPublishedUpcoming: `
    SELECT * FROM workshop 
    WHERE workshop_status = 'published' 
      AND workshop_event_date > CURRENT_TIMESTAMP
    ORDER BY workshop_event_date ASC;
  `,
  // Retrieves past published workshops (events that have passed)
  getPublishedPast: `
    SELECT * FROM workshop
    WHERE workshop_status = 'published' 
      AND workshop_event_date <= CURRENT_TIMESTAMP 
    ORDER BY workshop_event_date DESC;
  `,
  // Retrieves a specific published workshop by workshop_id
  getPublishedById: `
    SELECT * FROM workshop
    WHERE workshop_status = 'published' 
      AND workshop_id = ?;
  `,
  // Marks a draft workshop as published
  insertIntoPublished: `
    UPDATE workshop
    SET workshop_status = 'published' 
    WHERE workshop_status = 'draft' 
      AND workshop_id = ?;
  `,
  // Deletes a published workshop by its ID
  deletePublishedById: `
    DELETE FROM workshop
    WHERE workshop_status = 'published' 
      AND workshop_id = ?;
  `,
  // Updates a published workshop's details (title, subtitle, description, last modified time)
  updatePublishedById: `
    UPDATE workshop
    SET workshop_title = ?, workshop_subtitle = ?, workshop_description = ?, workshop_last_modified = ?
    WHERE workshop_status = 'published' 
      AND workshop_id = ?;
  `,

  // Workshop Drafts Queries
  // Retrieves all workshops with a 'draft' status
  getAllDrafts: `
    SELECT * FROM workshop
    WHERE workshop_status = 'draft';
  `,
  // Retrieves a specific draft workshop by workshop_id
  getDraftById: `
    SELECT * FROM workshop
    WHERE workshop_status = 'draft' 
      AND workshop_id = ?;
  `,
  // Updates a draft workshop's details (title, subtitle, description, last modified time)
  updateDraftById: `
    UPDATE workshop
    SET workshop_title = ?, workshop_subtitle = ?, workshop_description = ?, workshop_last_modified = ?
    WHERE workshop_status = 'draft' 
      AND workshop_id = ?;
  `,
  // Deletes a draft workshop by its ID
  deleteDraftById: `
    DELETE FROM workshop
    WHERE workshop_status = 'draft' 
      AND workshop_id = ?;
  `,
  // Inserts a new draft workshop
  insertIntoDraft: `
    INSERT INTO workshop
    (workshop_code, workshop_title, workshop_subtitle, workshop_description, workshop_created_time,
    workshop_last_modified, workshop_available_tickets,workshop_event_date, workshop_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft');
  `,

  // Ticket Queries
  // Retrieves tickets associated with a specific workshop by its ID
  selectTicketById: `
    SELECT tickets_id, tickets_type, tickets_price, tickets_number_available
    FROM tickets
    WHERE tickets_workshop_id = ?;
  `,
  // Updates ticket details (type, available count, price) based on ticket_id
  updateTicketById: `
    UPDATE tickets
    SET tickets_type = ?, tickets_number_available = ?, tickets_price = ?
    WHERE tickets_id = ?;
  `,

  // Inserts a VIP ticket for a specific workshop
  insertVIPTickets: `
    INSERT INTO tickets (tickets_type, tickets_number_available, tickets_price, tickets_workshop_id)
    VALUES ('VIP', ?, ?, ?);
  `,

  // Inserts a General ticket for a specific workshop
  insertGeneralTickets: `
    INSERT INTO tickets (tickets_type, tickets_number_available, tickets_price, tickets_workshop_id)
    VALUES ('General', ?, ?, ?);
  `,

  // Deletes all tickets associated with a specific draft workshop by its ID
  deleteTicketByDraftId: `
    DELETE FROM tickets
    WHERE tickets_workshop_id = ?;
  `,

  // Retrieves all booked tickets
  getBookedTickets: `
    SELECT * FROM booked_tickets;
  `,

  // Retrieves bookings by booked_tickets_tickets_id
  getBookingsByBookedTicketsId: `
    SELECT * FROM booked_tickets
    WHERE booked_tickets_tickets_id = ?;
  `,

  // Retrieves tickets by the ticket workshop ID
  getticketsByTicketWorkshopId: `
    SELECT * FROM tickets
    WHERE tickets_workshop_id = ?;
  `,

  // Inserts a new user into the 'users' table
  createUser: `
    INSERT INTO users (user_name, user_email)
    VALUES(?,?);
  `,

  // Creates a new booked ticket for a user
  createBookedTickets: `
    INSERT INTO booked_tickets (booked_tickets_user_id, booked_tickets_tickets_id, booked_tickets_tickets_number, booked_tickets_time)
    VALUES(?,?,?,?);
  `,

  // Updates the available ticket count after a booking is made
  updateTicketCounts:  `
    UPDATE tickets
    SET tickets_number_available = tickets_number_available - ?
    WHERE tickets_id = ?;
  `,
}

module.exports = Queries;
