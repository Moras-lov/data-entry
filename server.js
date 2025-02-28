const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import the database module
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'https://moraslov.vercel.app' // Allow only this origin
}));
app.use(bodyParser.json());

let data = [];

// Route for the root URL
// app.get('/', (req, res) => {
    // res.send('Welcome to the Data Entry Web App!');
// });

// Save data
app.post('/save', (req, res) => {
    const { name, date, b150, b200, b250, b700, btol} = req.body;

    // Validate required fields
    if (!name || !date || isNaN(b150) || isNaN(b200)|| !b250 || !b700) {
        return res.status(400).send('Invalid data. Please check all fields.');
    }

    const query = `
        INSERT INTO entries ( name, date, b150, b200, b250, b700, btol)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [name, date, b150, b200, b250, b700, btol];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).send('Failed to save data.');
        }
		console.log('Data saved:', { id: this.lastID, name, date, b150, b200, b250, b700, btol });
        res.send('Data saved successfully!');
    });
});

// Get all data (with search functionality)
app.get('/data', (req, res) => {
	const { date, startDate, endDate } = req.query;
    const searchText = req.query.search ? req.query.search.toLowerCase() : '';
    
	let query = `SELECT * FROM entries`;
	let params = [];
	
	if (date) {
        // Filter by specific date
        query += ` WHERE date = ?`;
        params.push(date);
    } else if (startDate && endDate) {
        // Filter by date range
        query += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message); // Log the error
            return res.status(500).send('Failed to fetch data.');
        }
		if (rows.length === 0) {
            return res.status(404).json({ message: 'No results found.' });
        }
        console.log('Data fetched from database:', rows); // Log the fetched data
        return res.json(rows);
    });
});

app.put('/edit/:id', (req, res) => {
    const id = req.params.id;
     const { name, date, b150, b200, b250, b700,} = req.body;

    // Validate required fields
    if (!name || !date) {
        return res.status(400).send('Invalid data. Please check all fields.');
    }

    const query = `
        UPDATE entries
        SET name = ?, date = ?, b150 = ?, b200 = ?, b250 = ?, b700 = ?
        WHERE id = ?
    `;
    const params = [name, date, b150, b200, b250, b700, id];

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error updating data:', err.message);
            return res.status(500).send('Failed to update data.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Data not found.');
        }
        console.log('Data updated:', { id, name, date, b150, b200, b250, b700 });
        res.send('Data updated successfully!');
    });
});


// Delete data
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM entries WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting data:', err.message);
            return res.status(500).send('Failed to delete data.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Data not found.');
        }
        console.log('Data deleted:', { id });
        res.send('Data deleted successfully!');
    });
});


// Calculate the sum of Fields
app.get('/sum1', (req, res) => {
    const { date, startDate, endDate } = req.query;

    let query = `SELECT SUM(b150) AS sum FROM entries`;
    let params = [];

    if (date) {
        // Calculate sum for a specific date
        query += ` WHERE date = ?`;
        params.push(date);
    } else if (startDate && endDate) {
        // Calculate sum for a date range
        query += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }
	  db.get(query, params, (err, row) => {
        if (err) {
            console.error('Error calculating sum:', err.message);
            return res.status(500).send('Failed to calculate sum.');
        }
        console.log('Sum calculated:', row.sum || 0);
        res.json({ sum1: row.sum || 0 });
    });
});

app.get('/sum2', (req, res) => {
    const { date, startDate, endDate } = req.query;

    let query = `SELECT SUM(b200) AS sum FROM entries`;
    let params = [];

    if (date) {
        // Calculate sum for a specific date
        query += ` WHERE date = ?`;
        params.push(date);
    } else if (startDate && endDate) {
        // Calculate sum for a date range
        query += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }
	  db.get(query, params, (err, row) => {
        if (err) {
            console.error('Error calculating sum:', err.message);
            return res.status(500).send('Failed to calculate sum.');
        }
        console.log('Sum calculated:', row.sum || 0);
        res.json({ sum2: row.sum || 0 });
    });
});

app.get('/sum3', (req, res) => {
    const { date, startDate, endDate } = req.query;

    let query = `SELECT SUM(b250) AS sum FROM entries`;
    let params = [];

    if (date) {
        // Calculate sum for a specific date
        query += ` WHERE date = ?`;
        params.push(date);
    } else if (startDate && endDate) {
        // Calculate sum for a date range
        query += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }
	  db.get(query, params, (err, row) => {
        if (err) {
            console.error('Error calculating sum:', err.message);
            return res.status(500).send('Failed to calculate sum.');
        }
        console.log('Sum calculated:', row.sum || 0);
        res.json({ sum3: row.sum || 0 });
    });
});
	
app.get('/sum4', (req, res) => {
    const { date, startDate, endDate } = req.query;

    let query = `SELECT SUM(b700) AS sum FROM entries`;
    let params = [];

    if (date) {
        // Calculate sum for a specific date
        query += ` WHERE date = ?`;
        params.push(date);
    } else if (startDate && endDate) {
        // Calculate sum for a date range
        query += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }
	  db.get(query, params, (err, row) => {
        if (err) {
            console.error('Error calculating sum:', err.message);
            return res.status(500).send('Failed to calculate sum.');
        }
        console.log('Sum calculated:', row.sum || 0);
        res.json({ sum4: row.sum || 0 });
    });
});
	
app.get('/sum5', (req, res) => {
    const { date, startDate, endDate } = req.query;

    let query = `SELECT SUM(btol) AS sum FROM entries`;
    let params = [];

    if (date) {
        // Calculate sum for a specific date
        query += ` WHERE date = ?`;
        params.push(date);
    } else if (startDate && endDate) {
        // Calculate sum for a date range
        query += ` WHERE date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }
	  db.get(query, params, (err, row) => {
        if (err) {
            console.error('Error calculating sum:', err.message);
            return res.status(500).send('Failed to calculate sum.');
        }
        console.log('Sum calculated:', row.sum || 0);
        res.json({ sum5: row.sum || 0 });
    });
});

//const port = 3000

app.listen(port, () => {
    console.log('Server running on ${port}');
});
   
