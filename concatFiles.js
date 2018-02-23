var concat = require('concat-files');

concat([
  './src/sum.js',
  './src/div.js'
], './build/RPGLib.js', function(err) {
  if (err){
    throw err
  }
  console.log('done');
});
