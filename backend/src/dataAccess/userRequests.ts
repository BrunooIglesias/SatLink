import mysql from 'mysql2/promise';

export async function insertRequest(email, name, coordinates, satellite) {
    
    try {
        const connection = await mysql.createConnection({
          host: 'localhost',
          port: 3306,
          user: 'myuser',         // Replace with your MySQL username
          password: 'mypassword', // Replace with your MySQL password
          database: 'mydatabase', // Replace with your MySQL database name
      });
        const pendingRequestQuery = `
            INSERT INTO PendingRequests (email, name, coordinates, satellite) 
            VALUES (?, ?, ?, ?)`;

        await connection.execute(pendingRequestQuery, [
          email,
          name,
          coordinates,
          satellite
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

