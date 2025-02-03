# "Seeing Beyond Pixels" Microblog System Documentation

## Overview

"Seeing Beyond Pixels" is a microblogging platform dedicated to sharing insights, techniques, and innovations in the field of Computer Vision. This platform will help connect professionals, researchers, and enthusiasts with the latest in computer vision workshops, tutorials, and cutting-edge research.  It provides functionality for both administrators (author) and readers to interact with blog content, workshops, tickets, and bookings. The system allows CRUD operations for blog settings, workshop drafts, published content, and handles ticket sales and bookings.

This project uses Node.js for the backend, Express as the web framework, SQLite as the database, and EJS for templating.

## Folder Structure

- **`routes/`**: Contains all route files that handle HTTP requests and serve corresponding views.
    - `author.js`: Manages routes and logic for the blog administrator (author).
    - `home.js`: Handles the route for the author's homepage.
    - `reader.js`: Handles the route for readers (viewing workshops and booking tickets).

- **`views/`**: Contains the EJS templates for rendering HTML pages dynamically.
    - `author-home.ejs`: Displays the author's homepage with a list of drafts and published workshops, along with options for managing content.
    - `booking.ejs`: A page that displays booking details and allows readers to confirm their ticket bookings.
    - `draft-create.ejs`: A form for creating new drafts, including workshop details and ticket options.
    - `draft-edit.ejs`: Allows the author to edit an existing draft before publishing or deleting it.
    -*`event-edit.ejs`: Provides the interface for editing the details of a specific event/workshop.
    - `home.ejs`: Displays general blog information, workshops, and events, and serves as the entry point to the system for both authors and readers.
    - `reader-home.ejs`: The reader's homepage displaying a list of upcoming and past workshops, along with the option to book tickets.
    - `site-setting.ejs`: Provides the form to manage the general blog settings such as blog title, description, and other settings.

- **`public/`**: Contains all public-facing assets, such as CSS, JavaScript, and image files.
    - `main.css`: The main stylesheet for the platform, containing global styles and layout configurations.

- **`utility/`**: Contains utility functions and common queries for easier database interaction and formatting.
    - `timestampUtils.js`: Utility functions for formatting timestamps in the correct structure.
    - `queries.js`: Common SQL queries that can be reused across different routes.

- **`database`**: Contains the database schema and related files.
    - `db_schema.sql`: The SQL file that defines the schema for the SQLite database, including tables for workshops, tickets, users, and bookings.


## Routes

### `author.js`

This file handles the routes for the blog administrator, including operations for managing blog settings, drafts, published workshops, and ticket bookings.

#### Routes Overview

- **GET `/setting`**: Renders the page to view and edit blog settings.
- **POST `/setting/:id`**: Updates blog settings.
- **GET `/home`**: Displays the author's homepage with drafts and published workshops.
- **GET `/draft-edit/:id`**: Renders the page to edit a specific workshop draft.
- **POST `/draft-edit/:id`**: Updates workshop draft information and associated tickets.
- **POST `/draft-publish/:id`**: Publishes a draft, moving it to the published section.
- **POST `/draft-delete/:id`**: Deletes a draft and associated tickets.
- **GET `/draft-create`**: Displays the form to create a new draft.
- **POST `/draft-create`**: Creates a new draft and associated tickets.
- **POST `/published-delete/:id`**: Deletes a published workshop and associated tickets.
- **GET `/booking`**: Displays all bookings for published workshops.
  
#### Key Operations

- **CRUD Operations** on Blog Settings, Drafts, and Published Content
- **Ticket Management** for workshops (VIP and General tickets)
- **Database Interactions** with SQLite (queries, inserts, updates, deletes)

---

### `home.js`

This file defines the route for displaying the author's homepage. It fetches blog details from the database and renders the `home.ejs` view.

#### Route Overview

- **GET `/`**: Fetches blog info and renders the homepage for the author.

---

### `reader.js`

This file manages routes for the reader section, enabling readers to view workshops, book tickets, and interact with the content.

#### Routes Overview

- **GET `/home`**: Displays a list of upcoming and past workshops.
- **GET `/event/:id`**: Displays details of a specific workshop and allows ticket booking.
- **POST `/event/:id`**: Processes ticket bookings for a specific event.

#### Key Operations

- **Viewing Upcoming and Past Workshops**
- **Booking Tickets** for workshops
- **Database Interactions** with SQLite (queries for workshops, tickets, bookings)

---

## Database Schema

The system uses SQLite as the database for storing information. The relevant tables and their purpose include:

- **`workshop`**: Stores information about workshops.
- **`tickets`**: Stores information about tickets (VIP, General).
- **`users`**: Stores user information for bookings.
- **`booked_tickets`**: Stores ticket booking information for users.
- **`blog_info`**: Stores the settings for the blog.

---

## Utility Functions

The `utility` folder contains functions for formatting timestamps and queries used in the system.

- **`getFormattedTimestamp()`**: Returns the current timestamp in a formatted string.
- **Queries**: Contains SQL queries used across various routes for fetching, inserting, updating, and deleting data.

---

## Frontend Details

### EJS Templating

EJS (Embedded JavaScript) is used to dynamically render views on the server side. The views are templates with placeholders that are populated with data fetched from the backend. 

#### Key EJS Files

- **`author-home.ejs`**: The author's homepage displaying a list of drafts and published workshops, with actions to manage each.
- **`booking.ejs`**: Displays ticket booking details, including available tickets and the option for users to confirm or cancel their booking.
- **`draft-create.ejs`**: The page that enables the author to create new drafts, including providing details like workshop title, description, and ticket options.
- **`draft-edit.ejs`**: A page for editing the details of an existing workshop draft, including titles, descriptions, and associated tickets.
- **`event-edit.ejs`**: Allows the author to edit the specifics of a workshop event, such as time, location, and ticket information.
- **`home.ejs`**: The homepage for both readers and authors, showing blog information and upcoming workshops.
- **`reader-home.ejs`**: A page designed for readers to see upcoming workshops and select which ones to attend.
- **`site-setting.ejs`**: A form for managing the site's settings, such as title, description, and other configurations.


## Error Handling

The system uses standard error handling practices:

- **SQLite Errors**: Errors related to database interactions are logged with descriptive messages.
- **Route Errors**: If any error occurs during data fetching or rendering, the user is presented with an appropriate error message.

---

## Setup Instructions

1. **Install Dependencies**: Run `npm install` to install required Node.js packages.
2. **Set Up SQLite Database**: Ensure the SQLite database is properly set up and contains the necessary tables (e.g., `workshop`, `tickets`, `users`).
3. **Run the Application**: Use `node app.js` to start the server and begin interacting with the system.

---


# Full Workflow for Author and Reader

## 1. Author's Workflow

### 1.1 Blog Settings
1. Author accesses `/setting` to view and edit blog settings (title, subtitle, author name).
2. Submits changes; updates are reflected in the `blog_info` table.

### 1.2 Create a New Draft
1. Author accesses `/home` and clicks "Create New Draft."
2. Fills out workshop details (title, subtitle, description, event date) and ticket info (type, price, availability).
3. Submits the form; data is inserted into the `workshop` and `tickets` tables.

### 1.3 Edit a Draft
1. Author accesses drafts at `/home`.
2. Selects a draft to edit and updates workshop or ticket details.
3. Submits the form; data is updated in the `workshop` and `tickets` tables.

### 1.4 Publish a Draft
1. Author selects "Publish" for the draft at `/draft-publish/:id`.
2. Workshop status changes to "published" in the `workshop` table.
3. Published workshop is accessible via the author's **Home Page** (`/home`) and **Reader's Home Page** (`/reader-home`).

### 1.5 Share Published Workshop
1. Author shares the published workshop by accessing `/home` and clicking the "Share" button next to a published workshop.
2. The share link is generated and can be shared externally (via social media, email, etc.) with readers.
3. The shared link directs readers to the **Reader's Home Page** (`/reader-home`), where they can view and book tickets for the shared workshop.

### 1.6 Delete a Draft or Published Workshop
1. Author selects a draft or published workshop to delete at `/draft-delete/:id` or `/published-delete/:id`.
2. Confirms deletion, removing the entry from the `workshop` table and related data from the `tickets` table.

### 1.7 View Bookings
1. Author accesses `/booking` to view all ticket bookings made for published workshops.
2. The booking details (user, tickets, booking time) are displayed from the `booked_tickets` table.

---

## 2. Reader's Workflow

### 2.1 View Workshops
1. Reader accesses `/reader-home`, where **upcoming published workshops** are listed.
2. Selects a workshop to view details at `/event/:id`.

### 2.2 Book Tickets
1. Reader selects a ticket type (General, VIP, etc.) and number of tickets.
2. Submits the booking form.
3. Booking details are inserted into `booked_tickets`, and ticket availability is updated in the `tickets` table.

---

## 3. Backend Operations

### Insert Operations
- Author creates or edits a workshop: Insert/Update in `workshop` and `tickets`.
- Reader books tickets: Insert into `booked_tickets`, update `tickets`.

### Triggers
- Updates available tickets in the `workshop` table after any changes in the `tickets` table.

### Error Handling
- Database errors and booking failures are logged and presented with feedback.

---

## 4. Admin Dashboard (Author’s View)

- View and update **blog settings** (title, subtitle, etc.).
- Manage CRUD operations for **workshops**, including drafts and published content.
- View and manage **ticket bookings** for published workshops.
- **Share** published workshops by generating shareable links.

---

## 5. Reader Dashboard (Viewer’s View)

- View **upcoming** and **past workshops** (published).
- Book tickets for available workshops.
- Follow **shared links** to access specific workshops directly.

---

## 6. Home Page Access for Author and Reader

- **Author Home Page** (`/home`): Displays both drafts and published workshops that the author has created.
- **Reader Home Page** (`/reader-home`): Displays only published workshops that are available for booking.


---

## Conclusion

This blog offers an efficient platform for managing a blog, workshops, and ticketing for events. It provides intuitive CRUD operations for administrators and an easy ticket booking system for readers. With the help of SQLite, the blog is lightweight and capable of handling the necessary data storage for the application.
