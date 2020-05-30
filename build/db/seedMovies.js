"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setMovies;

var _initialize = require("./initialize");

function setMovies(movieArr) {
  var moviesRef = _initialize.db.collection("movies");

  var sets = movieArr.map(movie => {
    moviesRef.doc("".concat(movie.id)).set(movie);
  });
  return Promise.all(sets);
}
//# sourceMappingURL=seedMovies.js.map