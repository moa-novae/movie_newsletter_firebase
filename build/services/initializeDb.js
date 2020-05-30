"use strict";

require("dotenv/config");

var _seedGenres = _interopRequireDefault(require("../db/seedGenres"));

var _seedMovies = _interopRequireDefault(require("../db/seedMovies"));

var _seedTestUser = _interopRequireDefault(require("../db/seedTestUser"));

var _seedTopMovies = _interopRequireDefault(require("../db/seedTopMovies"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function initializeGenres() {
  return _initializeGenres.apply(this, arguments);
} //two api calls to different tmdb api routes are needed to gather all the info of a movie needed


function _initializeGenres() {
  _initializeGenres = _asyncToGenerator(function* () {
    try {
      var output = yield _axios.default.get("https://api.themoviedb.org/3/genre/movie/list?api_key=".concat(process.env.tmdbKey, "&language=en-US")); // console.log(output.data.genres)

      (0, _seedGenres.default)(output.data.genres);
    } catch (e) {
      console.log(e);
    }
  });
  return _initializeGenres.apply(this, arguments);
}

function initializeMonthlyMovies() {
  return _initializeMonthlyMovies.apply(this, arguments);
}

function _initializeMonthlyMovies() {
  _initializeMonthlyMovies = _asyncToGenerator(function* () {
    function fetchAdditionalMovieInfo(_x) {
      return _fetchAdditionalMovieInfo.apply(this, arguments);
    } //FIRST API CALL


    function _fetchAdditionalMovieInfo() {
      _fetchAdditionalMovieInfo = _asyncToGenerator(function* (id) {
        var output = yield _axios.default.get("\n    https://api.themoviedb.org/3/movie/".concat(id, "?api_key=").concat(process.env.tmdbKey, "&language=en-US\n    "));
        return output.data;
      });
      return _fetchAdditionalMovieInfo.apply(this, arguments);
    }

    try {
      yield* function* () {
        var pageNumber = 1;
        var movies = [];
        var output = yield _axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=").concat(pageNumber, "&primary_release_date.gte=2020-05-12&primary_release_date.lte=2020-06-12")); //find total pages of results that is available on tmdb

        var totalPages = output.data["total_pages"]; //push the movies obj on first page to an array

        for (var movie of output.data.results) {
          movies.push(movie);
        } //call the rest of the result pages and push to movies array


        var moviesAfterPageOne = [];

        for (var i = 2; i <= totalPages; i++) {
          moviesAfterPageOne.push(_axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=").concat(i, "&primary_release_date.gte=2020-05-12&primary_release_date.lte=2020-06-12")).then(output => {
            for (var _movie of output.data.results) {
              movies.push(_movie);
            }
          }));
        }

        yield Promise.allSettled(moviesAfterPageOne);
        var movieObjs = []; //Once all basic movie info is aquired from tmdb, get additional info such as production company from tmdb api (details)
        //SECOND API CALL

        Promise.allSettled(movies.map(movie => fetchAdditionalMovieInfo(movie.id).then(additionalInfo => _objectSpread(_objectSpread({}, movie), additionalInfo)))).then(movies => {
          for (var _movie2 of movies) {
            movieObjs.push(_movie2.value);
          } //send the completed movie jsons to firebase


          (0, _seedMovies.default)(movieObjs);
        }); // setMovies(output.data.results);
      }();
    } catch (e) {
      console.log(e);
    }
  });
  return _initializeMonthlyMovies.apply(this, arguments);
}

function initializeUsers() {
  return _initializeUsers.apply(this, arguments);
}

function _initializeUsers() {
  _initializeUsers = _asyncToGenerator(function* () {
    yield (0, _seedTestUser.default)();
    console.log("Test users set!");
  });
  return _initializeUsers.apply(this, arguments);
}

function initializeTopMovies() {
  return _initializeTopMovies.apply(this, arguments);
}

function _initializeTopMovies() {
  _initializeTopMovies = _asyncToGenerator(function* () {
    var topMoviesPromise = [];

    for (var i = 1; i <= 5; i++) {
      topMoviesPromise.push(_axios.default.get("https://api.themoviedb.org/3/movie/top_rated?api_key=".concat(process.env.tmdbKey, "&language=en-US&page=").concat(i)));
    }

    try {
      var output = yield Promise.all(topMoviesPromise);
      var movieArr = [];

      for (var page of output) {
        movieArr.push(...page.data.results.map(movie => ({
          movie_id: movie.id,
          title: movie.title,
          popularity: movie.popularity,
          adult: movie.adult
        })));
      } //fetch posters of top rated movies and each movie has at least one poster


      var imagesOfMovies = yield Promise.all(movieArr.map( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (movie) {
          var imagePathRespone = yield _axios.default.get("https://api.themoviedb.org/3/movie/".concat(movie.movie_id, "/images?api_key=").concat(process.env.tmdbKey));
          return imagePathRespone.data.backdrops;
        });

        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }()));

      for (var [_i, imagesOfMovie] of imagesOfMovies.entries()) {
        movieArr[_i].image_path = imagesOfMovie.map(image => "https://image.tmdb.org/t/p/original" + image.file_path //image.file_path is not the whole url
        );
      } //store top movies array in database


      (0, _seedTopMovies.default)(movieArr).then(console.log("top movies set"));
    } catch (e) {
      console.log(e);
      return;
    }
  });
  return _initializeTopMovies.apply(this, arguments);
}

(function () {
  initializeGenres();
  initializeTopMovies();
})();
//# sourceMappingURL=initializeDb.js.map