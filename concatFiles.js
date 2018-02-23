var concat = require('concat-files');

concat([
  '/src/'
], '/build/RPGLib.js', function(err) {
  if (err){
    throw err
  }
  console.log('done');
});
