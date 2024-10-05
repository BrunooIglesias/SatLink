import mysql from 'mysql2/promise';

export async function insertRequest(email, name, coordinates, satellite, cloudCover, dateFilters, metadata, dataValues, spectralSignature) {
    
    try {
        const connection = await mysql.createConnection({
          host: 'localhost',
          port: 3306,
          user: 'myuser',         
          password: 'mypassword',
          database: 'mydatabase', 
      });
        const pendingRequestQuery = `
            INSERT INTO PendingRequests (email, name, coordinates, satellite, cloudCover, dateFilters, metadata, dataValues, spectralSignature) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await connection.execute(pendingRequestQuery, [
          email,
          name,
          coordinates,
          satellite,
          cloudCover, 
          dateFilters,
          metadata,
          dataValues,
          spectralSignature

        ]);

        console.log('Inserted into PendingRequests successfully.');
      }
    catch (error) {
    }
}
export async function insertResult(email,name,image){
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'myuser',         // Replace with your MySQL username
      password: 'mypassword', // Replace with your MySQL password
      database: 'mydatabase', // Replace with your MySQL database name
  });
    const resultsRequestQuery = `
        INSERT INTO ResultsRequests (email, name, image) 
        VALUES (?, ?, ?)`;
    try{
      await connection.execute(resultsRequestQuery, [
          email,
          name,
          image
      ]);

      console.log('Inserted into ResultsRequests successfully.');

  } catch (error) {
      console.error('Error inserting data:', error);
  }
  
}

export async function getUsersInRegion(regionCoordinates) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'your_user',        
    password: 'your_password',
    database: 'your_database',
  });

  try {
    const [rows] = await connection.execute<[any[], any]>('SELECT id, email, coordinates FROM UserRequest');

    const usersInRegion: Array<{ id: number, email: string, coordinates: any }> = [];

    rows.forEach((row: { id: number, email: string, coordinates: string }) => {
      const userCoordinates = JSON.parse(row.coordinates); // Assuming coordinates are stored as JSON in DB

      // Check if the user's coordinates are inside the region
      if (isPointInSquare(userCoordinates, regionCoordinates)) {
        usersInRegion.push({
          id: row.id,
          email: row.email,
          coordinates: userCoordinates,
        });
      }
    });

    return usersInRegion; // Return the list of users in the region

  } catch (error) {
    console.error('Error querying the database:', error);
    throw error;
  } finally {
    await connection.end(); // Close the connection
  }
}

function isPointInSquare(point, square) {
  const [lngP, latP] = point;

  const lats = square.map(coord => coord[1]); // Get latitudes from square
  const lngs = square.map(coord => coord[0]); // Get longitudes from square

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return (lngP >= minLng && lngP <= maxLng) && (latP >= minLat && latP <= maxLat);
}

