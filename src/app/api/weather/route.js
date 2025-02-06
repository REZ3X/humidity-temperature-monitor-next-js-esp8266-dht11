import mysql from 'mysql2';

const db = mysql.createConnection({
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user: process.env.NEXT_PUBLIC_DB_USER,
    password: process.env.NEXT_PUBLIC_DB_PASSWORD,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    port: process.env.NEXT_PUBLIC_DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log(`Connected to database on port ${process.env.NEXT_PUBLIC_DB_PORT}`);
  }
});

/**
 * Handles GET requests to retrieve the latest weather data.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @returns {Promise<Response>} A promise that resolves to a Response object containing the weather data or an error message.
 */
export async function GET(req, res) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM weather_data ORDER BY timestamp DESC LIMIT 10', (err, results) => {
      if (err) {
        console.error('Error retrieving data:', err);
        resolve(new Response(JSON.stringify({ error: 'Error retrieving data' }), { status: 500 }));
      } else {
        resolve(new Response(JSON.stringify(results), { status: 200 }));
      }
    });
  });
}