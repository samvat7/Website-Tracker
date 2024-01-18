const Tracker = require('../models/Tracker');
const axios = require('axios');
const PingService = require('../services/pingService');

function formatUrl(url) {
    if (!url) {
        return '';
    }
    // Check if the URL starts with http:// or https://
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    // If not, prepend http:// to the URL
    return 'http://' + url;
}


module.exports.home = async (req, res) => {

    let trackers = await Tracker.find({});

    trackers.forEach(tracker => {
        console.log(tracker.url);
        PingService.addPingRequest(tracker.url, 1);
    });

    PingService.printQueue();

    res.render('home', {
        trackers: trackers
    });
}

module.exports.addTracker = async (req, res) => {

    let url = formatUrl(req.body.url);

    let interval = 60 * 60 * 100;

    try {
        const response = await axios.get(url);

        res.send(response.data.toString());

        // ----------------------------------------------- Save Tracker in Backend Code -----------------------------------------------
        try {
            let tracker = await Tracker.create({
                url: url,
                interval: interval,
                snapshot: response.data
            });

            if (req.xhr) {

                res.status(200).json({
                    tracker: tracker
                });
            }

            console.log('Tracker created: ', tracker);

            PingService.addPingRequest(url, interval);

        } catch (error) {
            console.log('Error in creating a tracker: ', error);
        }
        // -----------------------------------------------------------------------------------------------------------------------------

    } catch (error) {

        console.log('Error in fetching from the URL: ', error);
    }

}

module.exports.returnTrackers = async (req, res) => {

    let trackers = await Tracker.find({});

    res.send(trackers);
}

module.exports.clearTrackers = async (req, res) => {
    try {
        await Tracker.deleteMany({});
        console.log('Entries deleted.');
        res.status(200).send('Trackers cleared');
    } catch (err) {
        console.log('Error in deleting entries in Trackers: ', err);
        res.status(500).send('Error clearing trackers');
    }
};

module.exports.clearQueue = async (req,res) => {

    PingService.clearQueue();
    console.log(`Queue successfully cleared`)

    res.send("All trackers cleared");
}

