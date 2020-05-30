"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setGenres;

var _initialize = require("./initialize");

function setGenres(genreArr) {
  var genresRef = _initialize.db.collection("genres");

  var genresDoc = {};
  genreArr.forEach(genre => {
    genresDoc[genre.id] = {
      id: genre.id,
      name: genre.name
    };
  });
  return genresRef.doc("genres").set(genresDoc);
}
//# sourceMappingURL=seedGenres.js.map