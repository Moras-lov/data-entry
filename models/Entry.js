const mongoose = require('mongoose');

// Define the schema
const entrySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name is required
    date: { type: String, required: true }, // Date is required
    b150: { type: Number, required: true }, // b150 is required and must be a number
    b200: { type: Number, required: true }, // b200 is required and must be a number
    b250: { type: Number, required: true }, // b250 is required and must be a number
    b700: { type: Number, required: true }, // b700 is required and must be a number
    btol: { type: Number,} // btol is required and must be a number
});

// Create the model
const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;