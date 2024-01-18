const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/website_tracker`);
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
  
  //acquire connection (to check if it is successful)
  const db = mongoose.connection;
  
  //error
  db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));
  
  
  //once up and running, print a message
  db.once('open', function(){
      console.log('Successfully connected to the database');
  });