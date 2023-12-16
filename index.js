const express = require('express');
var mysql = require('mysql');
const app = express();
const post = 3000;
app.get('/', (req, res) => {
    res.send('Hello this is sample server');
});

dbConfig = {
    host: "lab1.cypy9rzv0wtk.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "mMr8hB0S7qYZgPD",
    database: "dev" // Thay 'your_database_name' bằng tên cơ sở dữ liệu của bạn
};
  
con = mysql.createConnection(dbConfig);

con.connect(function (err) {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }
    console.log('Connected to database with ID: ' + con.threadId);
  });

app.get('/mysql', (req, res) => {
    con.connect(function (err) {
        if (err) {
            res.send('Connection error: ' + err);
            return;
        }

        con.query("SHOW DATABASES;", function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    });
})

// Tạo một bệnh nhân mới
app.post('/patients', (req, res) => {
  const { name, age, address } = req.body;
  const sql = "INSERT INTO patients (name, age, address) VALUES (?, ?, ?)";
  const values = [name, age, address];

  con.query(sql, values, function (err, result) {
    if (err) {
      console.error('Error creating a patient: ' + err.stack);
      res.status(500).json({ error: 'An error occurred while creating a patient.' });
      return;
    }
    res.status(201).json({ message: 'Patient created successfully.' });
  });
});

// Lấy danh sách tất cả bệnh nhân
app.get('/patients', (req, res) => {
  const sql = "SELECT * FROM patients";

  con.query(sql, function (err, result) {
    if (err) {
      console.error('Error retrieving patients: ' + err.stack);
      res.status(500).json({ error: 'An error occurred while retrieving patients.' });
      return;
    }
    res.status(200).json(result);
  });
});

// Lấy thông tin của một bệnh nhân theo ID
app.get('/patients/:id', (req, res) => {
  const patientId = req.params.id;
  const sql = "SELECT * FROM patients WHERE id = ?";

  con.query(sql, patientId, function (err, result) {
    if (err) {
      console.error('Error retrieving patient: ' + err.stack);
      res.status(500).json({ error: 'An error occurred while retrieving the patient.' });
      return;
    }
    if (result.length === 0) {
      res.status(404).json({ error: 'Patient not found.' });
      return;
    }
    res.status(200).json(result[0]);
  });
});

// Cập nhật thông tin của một bệnh nhân theo ID
app.put('/patients/:id', (req, res) => {
  const patientId = req.params.id;
  const { name, age, address } = req.body;
  const sql = "UPDATE patients SET name = ?, age = ?, address = ? WHERE id = ?";
  const values = [name, age, address, patientId];

  con.query(sql, values, function (err, result) {
    if (err) {
      console.error('Error updating patient: ' + err.stack);
      res.status(500).json({ error: 'An error occurred while updating the patient.' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Patient not found.' });
      return;
    }
    res.status(200).json({ message: 'Patient updated successfully.' });
  });
});

// Xóa một bệnh nhân theo ID
app.delete('/patients/:id', (req, res) => {
  const patientId = req.params.id;
  const sql = "DELETE FROM patients WHERE id = ?";

  con.query(sql, patientId, function (err, result) {
    if (err) {
      console.error('Error deleting patient: ' + err.stack);
      res.status(500).json({ error: 'An error occurred while deleting the patient.' });
      return;
    }
    if (result.affectedRows ===0) {
      res.status(404).json({ error: 'Patient not found.' });
      return;
    }
    res.status(200).json({ message: 'Patient deleted successfully.' });
  });
});

app.listen(post, (req, res) => {
    console.log(`Example app listening on port ${post}!`);
})
