"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = seedTopMovies;

var _initialize = require("./initialize");

function seedTopMovies(moviesArr) {
  var usersRef = _initialize.db.collection("topMovies");

  var sets = moviesArr.map(user => {
    usersRef.add(user);
  });
  return Promise.all(sets);
}
//# sourceMappingURL=seedTopMovies.js.map