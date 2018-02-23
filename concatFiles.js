var concat = require('concat-files');

concat([
  '/my/first/file',
  '/another/file',
  '/one/last/file'
], '/build/destination', function(err) {
  if (err){
    throw err
  }
  console.log('done');
});
