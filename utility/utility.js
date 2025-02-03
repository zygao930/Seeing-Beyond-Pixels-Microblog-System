/**
 * Function to generate a formatted timestamp in 'YYYY-MM-DD HH:MM:SS' format
 * 
 * This function gets the current date and time, formats it into a readable 
 * string, and returns the formatted timestamp.
 * The month, day, hours, minutes, and seconds are padded with leading zeros 
 * if necessary to maintain a consistent two-digit format.
 * 
 * @returns {string} The current date and time in 'YYYY-MM-DD HH:MM:SS' format.
 */
function getFormattedTimestamp() {
   // Create a new Date object representing the current date and time
   const date = new Date();

   // Extract the year, month, day, hours, minutes, and seconds
   const year = date.getFullYear();
   const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adjust month to be 1-based (January = 1)
   const day = date.getDate().toString().padStart(2, '0');
   const hours = date.getHours().toString().padStart(2, '0');
   const minutes = date.getMinutes().toString().padStart(2, '0');
   const seconds = date.getSeconds().toString().padStart(2, '0');
   
   // Return the formatted date string
   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Export the function so it can be used in other parts of the application
module.exports = { getFormattedTimestamp };
