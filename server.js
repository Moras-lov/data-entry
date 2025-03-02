const express = require('express');
const bodyParser = require('body-parser');
const { connect, getDb } = require('./db');
const Entry = require('./models/Entry');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

let data = [];

// Save data
app.post('/save', async (req, res) => {
    const { name, date, b150, b200, b250, b700, btol} = req.body;

    // Validate required fields
    if (!name || !date || isNaN(b150) || isNaN(b200)|| !b250 || !b700) {
        return res.status(400).send('Invalid data. Please check all fields.');
    }

     try {
        // Create a new document using the Entry model
        const newEntry = new Entry({
            name,
            date,
             b150: parseFloat(b150),
            b200: parseFloat(b200),
            b250: parseFloat(b250),
            b700: parseFloat(b700),
            btol: parseFloat(btol)
        });

        // Save the document to the database
        await newEntry.save();

        console.log('Data saved:', newEntry);
        res.send('Data saved successfully!');
    } catch (err) {
        console.error('Error saving data:', err.message); // Log the error
        res.status(500).send('Failed to save data.');
    }
});

// Get all data (with search functionality)
app.get('/data', async (req, res) => {
	 const { date, startDate, endDate, search } = req.query;

    try {
        // Build the MongoDB query
        let query = {};
        if (date) {
            // Filter by specific date
            query.date = date;
        } else if (startDate && endDate) {
            // Filter by date range
            query.date = { $gte: startDate, $lte: endDate };
        }

        // Add search functionality (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
        }
		 // Fetch data from MongoDB using the Entry model
        const entries = await Entry.find(query); // Use Mongoose's `find` method
		
		  // Fetch data from MongoDB
        if (entries.length === 0) {
            return res.status(404).json({ message: 'No results found.' });
        }

        console.log('Data fetched from database:', entries); // Log the fetched data
        return res.json(entries);
    } catch (err) {
        console.error('Error fetching data:', err.message); // Log the error
        return res.status(500).send('Failed to fetch data.');
    }
});


// Route to update data
app.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { name, date, b150, b200, b250, b700 } = req.body;

    // Validate required fields
    if (!name || !date) {
        return res.status(400).send('Invalid data. Please check all fields.');
    }

    try {
        // Find the document by ID and update it
        const updatedEntry = await Entry.findByIdAndUpdate(
            id,
            { name, date, b150, b200, b250, b700 },
            { new: true } // Return the updated document
        );

        if (!updatedEntry) {
            return res.status(404).send('Data not found.');
        }


        console.log('Data updated:', updatedEntry);
        res.send('Data updated successfully!');
    } catch (err) {
        console.error('Error updating data:', err.message);
        res.status(500).send('Failed to update data.');
    }
});

// Route to delete data
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

     try {
        // Find the document by ID and delete it
        const deletedEntry = await Entry.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).send('Data not found.');
        }

        console.log('Data deleted:', deletedEntry);
        res.send('Data deleted successfully!');
    } catch (err) {
        console.error('Error deleting data:', err.message);
        res.status(500).send('Failed to delete data.');
    }
});

// Route to calculate the sum of a field
app.get('/sum1', async (req, res) => {
    const { date, startDate, endDate } = req.query;

    try {
        // Build the MongoDB query
        let query = {};
        if (date) {
            query.date = date; // Filter by specific date
        } else if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
        }

        // Calculate the sum of the `b150` field
        const result = await Entry.aggregate([
            { $match: query }, // Filter documents
            { $group: { _id: null, sum: { $sum: '$b150' } } } // Calculate sum
        ]);

        const sum = result.length > 0 ? result[0].sum : 0;
        console.log('Sum calculated:', sum);
        res.json({ sum1: sum });
    } catch (err) {
        console.error('Error calculating sum:', err.message);
        res.status(500).send('Failed to calculate sum.');
    }
});

app.get('/sum2', async (req, res) => {
    const { date, startDate, endDate } = req.query;

    try {
        // Build the MongoDB query
        let query = {};
        if (date) {
            query.date = date; // Filter by specific date
        } else if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
        }

        // Calculate the sum of the `b200` field
        const result = await Entry.aggregate([
            { $match: query }, // Filter documents
            { $group: { _id: null, sum: { $sum: '$b200' } } } // Calculate sum
        ]);
       
        const sum = result.length > 0 ? result[0].sum : 0;
        console.log('Sum calculated:', sum);
        res.json({ sum2: sum });
    } catch (err) {
        console.error('Error calculating sum:', err.message);
        res.status(500).send('Failed to calculate sum.');
    }
});


app.get('/sum3', async (req, res) => {
    const { date, startDate, endDate } = req.query;

    try {
        // Build the MongoDB query
        let query = {};
        if (date) {
            query.date = date; // Filter by specific date
        } else if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
        }

        // Calculate the sum of the `b250` field
        const result = await Entry.aggregate([
            { $match: query }, // Filter documents
            { $group: { _id: null, sum: { $sum: '$b250' } } } // Calculate sum
        ]);
      
        const sum = result.length > 0 ? result[0].sum : 0;
        console.log('Sum calculated:', sum);
        res.json({ sum3: sum });
    } catch (err) {
        console.error('Error calculating sum:', err.message);
        res.status(500).send('Failed to calculate sum.');
    }
});

	
app.get('/sum4', async (req, res) => {
    const { date, startDate, endDate } = req.query;

    try {
        // Build the MongoDB query
        let query = {};
        if (date) {
            query.date = date; // Filter by specific date
        } else if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
        }

        // Calculate the sum of the `b700` field
        const result = await Entry.aggregate([
            { $match: query }, // Filter documents
            { $group: { _id: null, sum: { $sum: '$b700' } } } // Calculate sum
        ]);
		
        const sum = result.length > 0 ? result[0].sum : 0;
        console.log('Sum calculated:', sum);
        res.json({ sum4: sum });
    } catch (err) {
        console.error('Error calculating sum:', err.message);
        res.status(500).send('Failed to calculate sum.');
    }
});

	
app.get('/sum5', async (req, res) => {
    const { date, startDate, endDate } = req.query;

    try {
        // Build the MongoDB query
        let query = {};
        if (date) {
            query.date = date; // Filter by specific date
        } else if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate }; // Filter by date range
        }

        // Calculate the sum of the `btol` field
       const result = await Entry.aggregate([
            { $match: query }, // Filter documents
            { $group: { _id: null, sum: { $sum: '$btol' } } } // Calculate sum
        ]);

        const sum = result.length > 0 ? result[0].sum : 0;
        console.log('Sum calculated:', sum);
        res.json({ sum5: sum });
    } catch (err) {
        console.error('Error calculating sum:', err.message);
        res.status(500).send('Failed to calculate sum.');
    }
});


app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
    