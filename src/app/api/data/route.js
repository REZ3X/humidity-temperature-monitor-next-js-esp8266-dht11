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
 * @returns {Promise<Response>} A promise that resolves to a Response object containing the weather data or an error message.
 */
export async function GET() {
  return new Promise((resolve) => {
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

/**
 * Handles POST requests to insert temperature and humidity data into the database.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 *
 * @throws {Error} - Throws an error if there is an issue with the database query.
 */
export async function POST(req) {
  const { temperature, humidity } = await req.json();

  if (typeof temperature !== 'number' || typeof humidity !== 'number') {
    return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
  }

  return new Promise((resolve) => {
    db.query(
      'INSERT INTO weather_data (temperature, humidity) VALUES (?, ?)',
      [temperature, humidity],
      (err) => {
        if (err) {
          console.error('Error inserting data:', err);
          resolve(new Response(JSON.stringify({ error: 'Error inserting data' }), { status: 500 }));
        } else {
          resolve(new Response(JSON.stringify({ message: 'Data inserted successfully' }), { status: 200 }));
        }
      }
    );
  });
}