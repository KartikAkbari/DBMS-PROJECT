const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567',
  database: 'try_db'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add Patient
app.post('/addpatient', (req, res) => {
  const {
    patientId,
    patientName,
    age,
    dob,
    gender,
    address,
    phone,
    email
  } = req.body;

  const sql = 'INSERT INTO patients (patientId, patientName, age, dob, gender, address, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [patientId, patientName, age, dob, gender, address, phone, email];

  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Patient added to database');
    res.send('Patient added successfully');
  });
});

//Schedule Appointment
app.post('/scheduleappointment', (req, res) => {
  const {
    patientName,
    doctorName,
    scheduleDate,
    scheduleTime,
  } = req.body;

  const sql = 'INSERT INTO Appointment ( patientName, doctorName, scheduleDate, scheduleTime) VALUES (?, ?, ?, ?)';
  const values = [patientName, doctorName, scheduleDate, scheduleTime];

  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Schedule added to database');
    res.send('Scheduled the appointment successfully');
  });
});

//Add Bill
app.post('/addbill', (req, res) => {
  const {
    patientId,
    patientName,
    billDate,
    totalAmount,
    paymentStatus,
  } = req.body;

  const sql = 'INSERT INTO Bill ( patientId, patientName, billDate, totalAmount, paymentStatus) VALUES (?, ?, ?, ?, ?)';
  const values = [patientId, patientName, billDate, totalAmount, paymentStatus];

  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Bill added to database');
    res.send('Bill added successfully');
  });
});

//Add Prescriptions
app.post('/addprescriptions', (req, res) => {
  const {
    patientId, 
    patientName, 
    doctorId, 
    datePrescribed, 
    medication, 
    dosage,
  } = req.body;

  const sql = 'INSERT INTO Prescription ( patientId, patientName, doctorId, datePrescribed, medication, dosage) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [patientId, patientName, doctorId, datePrescribed, medication, dosage];

  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Prescription added to database');
    res.send('Prescription added successfully');
  });
});
//Add rooms
app.post('/addrooms', (req, res) => {
  const {
    patientId, 
    roomNumber, 
    roomType, 
    dateOccupied,
  } = req.body;

  const sql = 'INSERT INTO Room ( patientId, roomNumber, roomType, dateOccupied) VALUES (?, ?, ?, ?)';
  const values = [patientId, roomNumber, roomType, dateOccupied];

  db.query(sql, values, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Room added to database');
    res.send('Room added successfully');
  });
});
//View Patients
app.get('/viewpatients', (req, res) => {
  let filters = req.query;

  let filterQuery = 'SELECT * FROM patients';
  let filterValues = [];

  if (Object.keys(filters).length > 0) {
      filterQuery += ' WHERE ';
      let conditions = [];
      for (let key in filters) {
          if (filters[key]) {
              conditions.push(`${key} = ?`);
              filterValues.push(filters[key]);
          }
      }
      filterQuery += conditions.join(' AND ');
  }

  db.query(filterQuery, filterValues, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error fetching data');
      }

      if (result.length === 0) {
          return res.send(`
              <style>
              h1, p {
                color: white;
              }
              body{
              background: rgb(2,0,36);
              background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
              }
              </style>
              <h1>No Records Found</h1>
              <p>No patient records match the specified criteria.</p>
          `);
      }

      res.send(`
          <style>
          body{
            background: rgb(2,0,36);
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
          }
          table {
            background-color: white;
            border-collapse: collapse;
            width: 100%;
          }
          h1{
            color:white;
          }
          th, td {
            background-color: white;
            border: 1px solid black;
            padding: 8px;
            text-align: left;
           }
          </style>
          <h1>View Patients</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
              </tr>
              ${result.map(row => `
                  <tr>
                      <td>${row.patientId}</td>
                      <td>${row.patientName}</td>
                      <td>${row.age}</td>
                      <td>${new Date(row.dob).toLocaleDateString()}</td>
                      <td>${row.gender}</td>
                      <td>${row.address}</td>
                      <td>${row.phone}</td>
                      <td>${row.email}</td>
                  </tr>
              `).join('')}
          </table>
      `);
  });
});

//View Rooms
app.get('/viewrooms', (req, res) => {
  let filters = req.query;

  let filterQuery = 'SELECT * FROM Room';
  let filterValues = [];

  if (Object.keys(filters).length > 0) {
      filterQuery += ' WHERE ';
      let conditions = [];
      for (let key in filters) {
          if (filters[key]) {
              conditions.push(`${key} = ?`);
              filterValues.push(filters[key]);
          }
      }
      filterQuery += conditions.join(' AND ');
  }

  db.query(filterQuery, filterValues, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error fetching data');
      }

      if (result.length === 0) {
          return res.send(`
          <style>
              h1, p {
                color: white;
              }
              body{
              background: rgb(2,0,36);
              background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
              }
              </style>
              <h1>No Records Found</h1>
              <p>No room records found.</p>
          `);
      }

      res.send(`
      <style>
      body{
        background: rgb(2,0,36);
        background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
      }
      table {
        background-color: white;
        border-collapse: collapse;
        width: 100%;
      }
      h1{
        color:white;
      }
      th, td {
        background-color: white;
        border: 1px solid black;
        padding: 8px;
        text-align: left;
       }
      </style>
          <h1>Room Data</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Patient ID</th>
                  <th>Room Number</th>
                  <th>Room Type</th>
                  <th>Date Occupied</th>
              </tr>
              ${result.map(row => `
                  <tr>
                      <td>${row.room_id}</td>
                      <td>${row.patientId}</td>
                      <td>${row.roomNumber}</td>
                      <td>${row.roomType}</td>
                      <td>${new Date(row.dob).toLocaleDateString()}</td>
                  </tr>
              `).join('')}
          </table>
      `);
  });
});
//View Prescription
app.get('/viewprescriptions', (req, res) => {
  let filters = req.query;

  let filterQuery = 'SELECT * FROM Prescription';
  let filterValues = [];

  if (Object.keys(filters).length > 0) {
      filterQuery += ' WHERE ';
      let conditions = [];
      for (let key in filters) {
          if (filters[key]) {
              conditions.push(`${key} = ?`);
              filterValues.push(filters[key]);
          }
      }
      filterQuery += conditions.join(' AND ');
  }

  db.query(filterQuery, filterValues, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error fetching data');
      }

      if (result.length === 0) {
          return res.send(`
          <style>
          h1, p {
            color: white;
          }
          body{
          background: rgb(2,0,36);
          background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
          }
          </style>
              <h1>No Records Found</h1>
              <p>No prescription records match the specified criteria.</p>
          `);
      }

      res.send(`
      <style>
      body{
        background: rgb(2,0,36);
        background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
      }
      table {
        background-color: white;
        border-collapse: collapse;
        width: 100%;
      }
      h1{
        color:white;
      }
      th, td {
        background-color: white;
        border: 1px solid black;
        padding: 8px;
        text-align: left;
       }
      </style>
          <h1>Prescription Data</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Doctor ID</th>
                  <th>Date Prescribed</th>
                  <th>Medication</th>
                  <th>Dosage</th>
              </tr>
              ${result.map(row => `
                  <tr>
                      <td>${row.prescription_id}</td>
                      <td>${row.patientId}</td>
                      <td>${row.patientName}</td>
                      <td>${row.doctorId}</td>
                      <td>${new Date(row.datePrescribed).toLocaleDateString()}</td>
                      <td>${row.medication}</td>
                      <td>${row.dosage}</td>
                  </tr>
              `).join('')}
          </table>
      `);
  });
});

//View Bills
app.get('/viewbills', (req, res) => {
  let filters = req.query;

  let filterQuery = 'SELECT * FROM Bill';
  let filterValues = [];

  if (Object.keys(filters).length > 0) {
      filterQuery += ' WHERE ';
      let conditions = [];
      for (let key in filters) {
          if (filters[key]) {
              conditions.push(`${key} = ?`);
              filterValues.push(filters[key]);
          }
      }
      filterQuery += conditions.join(' AND ');
  }

  db.query(filterQuery, filterValues, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error fetching data');
      }

      if (result.length === 0) {
          return res.send(`
          <style>
              h1, p {
                color: white;
              }
              body{
              background: rgb(2,0,36);
              background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
              }
              </style>
              <h1>No Records Found</h1>
              <p>No bill records match the specified criteria.</p>
          `);
      }

      res.send(`
      <style>
      body{
        background: rgb(2,0,36);
        background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
      }
      table {
        background-color: white;
        border-collapse: collapse;
        width: 100%;
      }
      h1{
        color:white;
      }
      th, td {
        background-color: white;
        border: 1px solid black;
        padding: 8px;
        text-align: left;
       }
      </style>
          <h1>Bill Data</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Total Amount</th>
                  <th>Bill Date</th>
                  <th>Payment Status</th>
              </tr>
              ${result.map(row => `
                  <tr>
                      <td>${row.bill_id}</td>
                      <td>${row.patientId}</td>
                      <td>${row.patientName}</td>
                      <td>${row.totalamount}</td>
                      <td>${new Date(row.billDate).toLocaleDateString()}</td>
                      <td>${row.paymentStatus}</td>
                  </tr>
              `).join('')}
          </table>
      `);
  });
});

//View Appointemnet
app.get('/viewappointments', (req, res) => {
  let filters = req.query;

  let filterQuery = 'SELECT * FROM Appointment';
  let filterValues = [];

  if (Object.keys(filters).length > 0) {
      filterQuery += ' WHERE ';
      let conditions = [];
      for (let key in filters) {
          if (filters[key]) {
              conditions.push(`${key} = ?`);
              filterValues.push(filters[key]);
          }
      }
      filterQuery += conditions.join(' AND ');
  }

  db.query(filterQuery, filterValues, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error fetching data');
      }

      if (result.length === 0) {
          return res.send(`
          <style>
          h1, p {
            color: white;
          }
          body{
          background: rgb(2,0,36);
          background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
          }
          </style>
              <h1>No Records Found</h1>
              <p>No appointment records match the specified criteria.</p>
          `);
      }

      res.send(`
      <style>
      body{
        background: rgb(2,0,36);
        background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
      }
      table {
        background-color: white;
        border-collapse: collapse;
        width: 100%;
      }
      h1{
        color:white;
      }
      th, td {
        background-color: white;
        border: 1px solid black;
        padding: 8px;
        text-align: left;
       }
      </style>
          </style>
          <h1>Appointment Data</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Schedule Date</th>
                  <th>Schedule Time</th>
              </tr>
              ${result.map(row => `
                  <tr>
                      <td>${row.appointment_id}</td>
                      <td>${row.patientName}</td>
                      <td>${row.doctorName}</td>
                      <td>${new Date(row.scheduleDate).toLocaleDateString()}</td>
                      <td>${row.scheduleTime}</td>
                  </tr>
              `).join('')}
          </table>
      `);
  });
});

//View Doctors
app.get('/viewdoctors', (req, res) => {
  let filters = req.query;

  let filterQuery = 'SELECT * FROM Doctor';
  let filterValues = [];

  if (Object.keys(filters).length > 0) {
      filterQuery += ' WHERE ';
      let conditions = [];
      for (let key in filters) {
          if (filters[key]) {
              conditions.push(`${key} = ?`);
              filterValues.push(filters[key]);
          }
      }
      filterQuery += conditions.join(' AND ');
  }

  db.query(filterQuery, filterValues, (err, result) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error fetching data');
      }

      if (result.length === 0) {
          return res.send(`
              <style>
              h1, p {
                color: white;
              }
              body{
              background: rgb(2,0,36);
              background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
              }
              </style>
              <h1>No Records Found</h1>
              <p>No Doctor records match the specified criteria.</p>
          `);
      }

      res.send(`
          <style>
          body{
            background: rgb(2,0,36);
            background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,62,121,1) 35%, rgba(0,212,255,1) 100%);
          }
          table {
            background-color: white;
            border-collapse: collapse;
            width: 100%;
          }
          h1{
            color:white;
          }
          th, td {
            background-color: white;
            border: 1px solid black;
            padding: 8px;
            text-align: left;
           }
          </style>
          <h1>View Doctors</h1>
          <table>
              <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Phone Number</th>
                  <th>Email</th>
              </tr>
              ${result.map(row => `
                  <tr>
                      <td>${row.doctor_id}</td>
                      <td>${row.name}</td>
                      <td>${row.specialization}</td>
                      <td>${row.phone_number}</td>
                      <td>${row.email}</td>
                  </tr>
              `).join('')}
          </table>
      `);
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
