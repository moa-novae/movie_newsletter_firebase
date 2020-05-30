"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sendNewsletter;

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _fetchFilters = _interopRequireDefault(require("../db/fetchFilters"));

var _sendEmail = _interopRequireDefault(require("./sendEmail"));

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

var _generateEmail = _interopRequireDefault(require("./generateEmail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("dotenv").config();

function getIdOfCasts(_x) {
  return _getIdOfCasts.apply(this, arguments);
}

function _getIdOfCasts() {
  _getIdOfCasts = _asyncToGenerator(function* (castArr) {
    var fetchIdPromises = castArr.map(cast => _axios.default.get("https://api.themoviedb.org/3/search/person?api_key=".concat(process.env.tmdbKey, "&query=").concat(encodeURI(cast), "&page=1&include_adult=false")));
    var castsArr = yield Promise.all(fetchIdPromises);
    var castIdsArr = [];
    castsArr.forEach(cast => {
      castIdsArr.push(cast.data.results[0].id);
    });
    return castIdsArr;
  });
  return _getIdOfCasts.apply(this, arguments);
}

function getIdOfCompany(_x2) {
  return _getIdOfCompany.apply(this, arguments);
}

function _getIdOfCompany() {
  _getIdOfCompany = _asyncToGenerator(function* (companyArr) {
    var fetchIdPromises = companyArr.map(company => _axios.default.get("https://api.themoviedb.org/3/search/company?api_key=".concat(process.env.tmdbKey, "&query=").concat(encodeURI(company), "&page=1&include_adult=false")));
    var companiesArr = yield Promise.all(fetchIdPromises);
    var companyIdsArr = [];
    companiesArr.forEach(company => {
      companyIdsArr.push(company.data.results[0].id);
    });
    return companyIdsArr;
  });
  return _getIdOfCompany.apply(this, arguments);
}

function discoverMovies(_x3, _x4, _x5, _x6, _x7) {
  return _discoverMovies.apply(this, arguments);
}

function _discoverMovies() {
  _discoverMovies = _asyncToGenerator(function* (castIdsArr, genreIdsArr, companyIdsArr, directorIdsArr, match) {
    var currentDate = (0, _moment.default)().format("YYYY-MM-DD");
    var threeMonthFuture = (0, _moment.default)().add(3, "M").format("YYYY-MM-DD");

    if (match === "all") {
      var castsStr = (castIdsArr === null || castIdsArr === void 0 ? void 0 : castIdsArr.join("")) || "";
      var genresStr = (genreIdsArr === null || genreIdsArr === void 0 ? void 0 : genreIdsArr.join("")) || "";
      var companiesStr = (companyIdsArr === null || companyIdsArr === void 0 ? void 0 : companyIdsArr.join("")) || "";
      var directorsStr = (directorIdsArr === null || directorIdsArr === void 0 ? void 0 : directorIdsArr.join("")) || "";
      var output = yield _axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=").concat(currentDate, "&primary_release_date.lte=").concat(threeMonthFuture, "&with_cast=").concat(castsStr, "&with_genres=").concat(genresStr, "&with_companies=").concat(companiesStr, "&with_crew=").concat(directorsStr));
      return output.data.results;
    }

    if (match === "any") {
      var _castsStr = castIdsArr.join("|") || "";

      var _genresStr = (genreIdsArr === null || genreIdsArr === void 0 ? void 0 : genreIdsArr.join("|")) || "";

      var _companiesStr = (companyIdsArr === null || companyIdsArr === void 0 ? void 0 : companyIdsArr.join("|")) || "";

      var _directorsStr = (directorIdsArr === null || directorIdsArr === void 0 ? void 0 : directorIdsArr.join("|")) || "";

      var finalResults = [];

      if (_castsStr) {
        var _output = yield _axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=").concat(currentDate, "&primary_release_date.lte=").concat(threeMonthFuture, "&with_cast=").concat(_castsStr));

        finalResults.push(..._output.data.results);
      }

      if (_genresStr) {
        var _output2 = yield _axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=").concat(currentDate, "&primary_release_date.lte=").concat(threeMonthFuture, "&with_genres=").concat(_genresStr));

        var _loop = function _loop(result) {
          if (finalResults.every(finalResult => finalResult.id !== result.id)) {
            finalResults.push(result);
          }
        };

        for (var result of _output2.data.results) {
          _loop(result);
        }
      }

      if (_companiesStr) {
        var _output3 = yield _axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=").concat(currentDate, "&primary_release_date.lte=").concat(threeMonthFuture, "&with_companies=").concat(_companiesStr));

        var _loop2 = function _loop2(_result) {
          if (finalResults.every(finalResult => finalResult.id !== _result.id)) {
            finalResults.push(_result);
          }
        };

        for (var _result of _output3.data.results) {
          _loop2(_result);
        }
      }

      if (_directorsStr) {
        var _output4 = yield _axios.default.get("https://api.themoviedb.org/3/discover/movie?api_key=".concat(process.env.tmdbKey, "&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=").concat(currentDate, "&primary_release_date.lte=").concat(threeMonthFuture, "&with_crew=").concat(_directorsStr));

        var _loop3 = function _loop3(_result2) {
          if (finalResults.every(finalResult => finalResult.id !== _result2.id)) {
            finalResults.push(_result2);
          }
        };

        for (var _result2 of _output4.data.results) {
          _loop3(_result2);
        }
      } //sort by popularity desc


      finalResults.sort((a, b) => b.popularity - a.popularity);
      return finalResults;
    }
  });
  return _discoverMovies.apply(this, arguments);
}

function getResultsForOneFilter(_x8) {
  return _getResultsForOneFilter.apply(this, arguments);
}

function _getResultsForOneFilter() {
  _getResultsForOneFilter = _asyncToGenerator(function* (filter) {
    var castIdsArr;
    var genreIdsArr;
    var companyIdsArr;
    var directorIdsArr;
    var match = filter.match;

    if (filter.cast) {
      castIdsArr = yield getIdOfCasts(filter.cast);
    }

    if (filter.genre) {
      genreIdsArr = filter.genre;
    }

    if (filter.productionCompany) {
      companyIdsArr = yield getIdOfCompany(filter.productionCompany);
    }

    if (filter.director) {
      directorIdsArr = yield getIdOfCasts(filter.director);
    }

    var filterResult = yield discoverMovies(castIdsArr, genreIdsArr, companyIdsArr, directorIdsArr, match);
    return {
      name: filter.name,
      results: filterResult
    };
  });
  return _getResultsForOneFilter.apply(this, arguments);
}

function recommendMoviesForUser(_x9) {
  return _recommendMoviesForUser.apply(this, arguments);
}

function _recommendMoviesForUser() {
  _recommendMoviesForUser = _asyncToGenerator(function* (userFilters) {
    //All filters
    var email = userFilters.email;
    var filters = userFilters.filters;
    var allFiltersResults = Object.values(filters).map(filter => {
      if (filter.enabled) {
        return getResultsForOneFilter(filter);
      } else {
        return {
          name: filter.name,
          results: null
        };
      }
    });
    var moviesForUser = yield Promise.all(allFiltersResults); //transform to correct strucuture for handlebar template

    function transformToEmailContext(filter) {
      if (filter.results) {
        return filter.results.map(result => ({
          imagePath: result["poster_path"] ? "https://image.tmdb.org/t/p/original/" + result["poster_path"] : "https://drive.google.com/uc?id=1VACVMbk6BHr1ae3JMYBHarXruWVn-whE",
          title: result.title,
          tag: result.overview
        }));
      } else {
        return null;
      }
    } //looping through return results of user's filters


    var filterResults = [];

    for (var filter of moviesForUser) {
      filterResults.push({
        name: filter.name,
        results: transformToEmailContext(filter)
      });
    }

    return {
      email,
      filterResults
    };
  });
  return _recommendMoviesForUser.apply(this, arguments);
}

function sendNewsletter() {
  return _sendNewsletter.apply(this, arguments);
} //send newsletter every month 


function _sendNewsletter() {
  _sendNewsletter = _asyncToGenerator(function* () {
    var users = yield (0, _fetchFilters.default)();
    var fetchUsersMovies = users.map(users => recommendMoviesForUser(users));
    var usersMovies = yield Promise.all(fetchUsersMovies);

    for (var user of usersMovies) {
      var msg = (0, _generateEmail.default)(user);
      (0, _sendEmail.default)(msg);
    }
  });
  return _sendNewsletter.apply(this, arguments);
}

function sendMonthlyNewsletter() {
  _nodeSchedule.default.scheduleJob({
    hour: 6,
    date: 1
  }, function () {
    sendNewsletter();
  });
}

sendMonthlyNewsletter();
//# sourceMappingURL=sendMonthlyNewsLetter.js.map