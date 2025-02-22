const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Initialize the database with a table
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
			date TEXT NOT NULL,
            b150 REAL NOT NULL,
            b200 REAL NOT NULL,
            b250 REAL NOT NULL,
            b700 REAL NOT NULL,
            btol REAL NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "entries" is ready.');
        }
    });
}
module.exports = db;