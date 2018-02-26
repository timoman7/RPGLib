/**
 * @module String
 * @submodule join
 * @for RPGLib
 * @requires core
 */

'use strict';

var RPGLib = require('../core/core');

RPGLib.join = function(){
  return (function(){let a="";[...arguments].forEach((b)=>{a+=b;});return a;})(...arguments);
};

module.exports = RPGLib;
