const mongoose = require('mongoose');

const trackerSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    interval: {

        type: Number,
        required: true
    },
    snapshot: {

        type: String
    }
}, {
    timestamps: true
});

const Tracker = mongoose.model('Tracker', trackerSchema);

module.exports = Tracker;