"use strict";

var _initialize = require("./initialize");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function exampleDataTwo(db) {
  // [START example_data_two]
  var citiesRef = db.collection("cities");
  var setSf = citiesRef.doc("SF").set({
    name: "San Francisco",
    state: "CA",
    country: "USA",
    capital: false,
    population: 860000
  });
  var setLa = citiesRef.doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA",
    capital: false,
    population: 3900000
  }); // [END example_data_two]

  return Promise.all([setSf, setLa]);
}

function getDocument(db) {
  // [START get_document]
  var cityRef = db.collection("cities").doc("SF");
  var getDoc = cityRef.get().then(doc => {
    if (doc.data().name === "San Francisco") {
      console.log("Test data saved!");
    } else {
      console.log("Something went wrong");
    }
  }).catch(err => {
    console.log("Error getting document", err);
  }); // [END get_document]

  return getDoc;
}

function deleteTestDocuments(_x) {
  return _deleteTestDocuments.apply(this, arguments);
}

function _deleteTestDocuments() {
  _deleteTestDocuments = _asyncToGenerator(function* (db) {
    var testData = db.collection("cities");
    var querySnapshot = yield testData.get();
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
    var postDeleteSnapshot = yield testData.get();

    if (!postDeleteSnapshot.exists) {
      console.log("Test data is deleted!");
    } else {
      console.log("Test data is not deleted");
    }
  });
  return _deleteTestDocuments.apply(this, arguments);
}

(function () {
  var _test = _asyncToGenerator(function* (db) {
    yield exampleDataTwo(db);
    yield getDocument(db);
    yield deleteTestDocuments(db);
  });

  function test(_x2) {
    return _test.apply(this, arguments);
  }

  return test;
})()(_initialize.db);
//# sourceMappingURL=test.js.map