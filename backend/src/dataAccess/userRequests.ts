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
      console.log('Error inserting data:', error, 'Data received: ', email, name, coordinates, satellite, cloudCover, dateFilters, metadata, dataValues, spectralSignature);
    }
}
export async function insertResult(email,name,image, metadata, dataValues, spectralSignature) {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'myuser',         // Replace with your MySQL username
      password: 'mypassword', // Replace with your MySQL password
      database: 'mydatabase', // Replace with your MySQL database name
  });
    const resultsRequestQuery = `
        INSERT INTO ResultsRequests (email, name, image, metadata, dataValues, spectralSignature) 
        VALUES (?, ?, ?, ?, ?, ?)`;
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

export async function getUsersInRegion(regionCoordinates, paramSatellite) {
  const connection = await mysql.createConnection({
    host: 'localhost',
            port: 3306,
            user: 'myuser',
            password: 'mypassword',
            database: 'mydatabase',
        });

  try {
    const [rows] = await connection.execute<[any[], any]>('SELECT id, email, coordinates FROM PendingRequests WHERE satellite = ?',
      [paramSatellite]);

    const usersInRegion: Array<{ id: number, email: string, coordinates: any, satellite : string, cloudCover : number, dateFilters : JSON, metadata:JSON, dataValues:JSON, spectralSignature:JSON}> = [];

    rows.forEach((row: { id: number, email: string, coordinates: any, satellite : string, cloudCover : number, dateFilters : JSON, metadata:JSON, dataValues:JSON, spectralSignature:JSON}) => {
      const userCoordinates = JSON.parse(row.coordinates); // Assuming coordinates are stored as JSON in DB

      // Check if the user's coordinates are inside the region
      if (isPointInSquare(userCoordinates, regionCoordinates)) {
        usersInRegion.push({
          id: row.id,
          email: row.email,
          coordinates: userCoordinates,
          satellite: row.satellite,
          cloudCover: row.cloudCover,
          dateFilters: row.dateFilters,
          metadata: row.metadata,
          dataValues: row.dataValues,
          spectralSignature: row.spectralSignature

        });
      }
    });

    return usersInRegion;

  } catch (error) {
    console.error('Error querying the database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}
export async function getResult(userParamId) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'your_user', // Replace with your MySQL username
    password: 'your_password', // Replace with your MySQL password
    database: 'your_database', // Replace with your MySQL database name
  });

  try {
    // Query to select results where ID matches userParamId
    const rows : any[] = await connection.execute('SELECT * FROM ResultsRequests WHERE id = ?', [userParamId]);
    
    if (rows.length === 0) {
      console.log(`No results found for ID: ${userParamId}`);
      return [];
    }

    return rows; // Return the results
  } catch (error) {
    console.error('Error fetching results:', error);
    throw error; // Rethrow the error for further handling if necessary
  } finally {
    await connection.end(); // Close the database connection
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
