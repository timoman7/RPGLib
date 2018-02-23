var concat = require('concat-files');

concat([
  './src/sum.js',
  './src/div.js'
], './build', function(err) {
  if (err){
    throw err
  }
  console.log('done');
});
