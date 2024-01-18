let fetch;

(async () => {
    fetch = (await import('node-fetch')).default;
})();
const PriorityQueue = require('./PriorityQueue');
const Tracker = require('../models/Tracker');

class PingService {
    constructor() {
        this.pingQueue = new PriorityQueue((a, b) => a.nextPingTime - b.nextPingTime);
        this.start();
        console.log(`Alert: Ping Service running...`);
    }

    //ONE time, CLIENT performed request
    addPingRequest(url, interval) {
            // const nextPingTime = Date.now() + interval * 60 * 1000; <---- USE THIS FOR PRODUCTION
            const nextPingTime = Date.now() + 20 * 1000;
            this.pingQueue.add({ url, nextPingTime });
            this.pingQueue.print();
    }

    printQueue(){

        this.pingQueue.print();
    }

    clearQueue(){

        this.pingQueue.clear();
    }

    //Called by SERVER at REGULAR intervals 
    async pingUrl(url) {
        try {
            const response = await fetch(url);

            let htmlContent = "";

            if (response.ok) {
                htmlContent = await response.text();

                try {
                    // Saving snapshot in DB
                    const updateList = await Tracker.find({ url: url });
                    
                    for (const tracker of updateList) {
                        tracker.snapshot = htmlContent;
                        await tracker.save();
                        console.log(`Tracker URL ${url} response saved at: ${Date.now()}`);

                        //Important: Here is where we will know if there's CHANGE in URL response, User can be alerted and frontend are reflect this change

                        //_________________________________________________[RESPONSE CHANGE DETECTION]___________________________________________________


                        //_________________________________________________[................]___________________________________________________

                        //TODO: Add lastChanged in Tracker Schema to keep track of last change detected for the URL

                        //TODO: Update lastChanged here
                    }
                } catch (dbError) {
                    console.error('Error in updating pinged URL snapshot: ', dbError);
                }
            }
            else{
                htmlContent = "Error in retrieving response";
            }

            console.log(`Fetched data from ${url}`);

        } catch (error) {
            console.error(`Error fetching from ${url}: `, error);
        }
    }

    start() {
        setInterval(async () => {

            const readableTime = new Date(Date.now()).toLocaleString();
            console.log(`[${readableTime}]Check for pending Ping Requests...`)

            let flag = false;
            
            while (!this.pingQueue.isEmpty() && this.pingQueue.peek().nextPingTime <= Date.now()) {

                flag = true;

                const { url, interval } = this.pingQueue.poll();
                await this.pingUrl(url);
                
                // const nextPing = Date.now()+interval; <--- USE FOR PRODUCTION
                const nextPing = Date.now() + 20*1000;

                //TODO: enqueue a ping request again to make a loop until 
                this.pingQueue.add({url, nextPingTime: nextPing});
                
                console.log(`Tracker URL ${url} pinged at: ${Date.now()}`);
            }

            if(!flag) console.log(`None found...`);
            
            console.log(`Queue size: ${this.pingQueue.size()}`);
        }, 10 * 1000); // Check every minute
    }
}

module.exports = new PingService();
