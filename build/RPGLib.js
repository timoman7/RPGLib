/*! Custom rpglib.js v1.0.0 February 26, 2018 
Contains the following modules : math, string*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RPGLib = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(_dereq_,module,exports){
/**
 * @module Structure
 * @submodule Structure
 * @for rpglib
 */

'use strict';

var RPGLib = function() {

};

RPGLib.textWorking = function(){
  console.log("Working");
  return 2;
};

module.exports = RPGLib;

},{}],2:[function(_dereq_,module,exports){
/**
 * @module Math
 * @submodule Divide
 * @for RPGLib
 * @requires core
 */

'use strict';

var RPGLib = _dereq_('../core/core');


RPGLib.div = function(a,b){
  return a/b;
};

module.exports = RPGLib;

},{"../core/core":1}],3:[function(_dereq_,module,exports){
/**
 * @module Math
 * @submodule Sum
 * @for RPGLib
 * @requires core
 */

'use strict';

var RPGLib = _dereq_('../core/core');

RPGLib.sum = function(a,b){
  return a+b;
};

module.exports = RPGLib;

},{"../core/core":1}],4:[function(_dereq_,module,exports){
/**
 * @module String
 * @submodule join
 * @for RPGLib
 * @requires core
 */

'use strict';

var RPGLib = _dereq_('../core/core');

RPGLib.join = function(){
  return (function(){let a="";[...arguments].forEach((b)=>{a+=b;});return a;})(...arguments);
};

module.exports = RPGLib;

},{"../core/core":1}]},{},[1,3,2,4])(4)
});