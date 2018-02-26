const sum = require('./sum');

test('sum 2 and 3', () =>{
  expect(sum.sum(2,3)).toBe(5);
});
