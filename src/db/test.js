import { db } from "./initialize";

function exampleDataTwo(db) {
  // [START example_data_two]
  const citiesRef = db.collection("cities");

  let setSf = citiesRef.doc("SF").set({
    name: "San Francisco",
    state: "CA",
    country: "USA",
    capital: false,
    population: 860000,
  });
  let setLa = citiesRef.doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA",
    capital: false,
    population: 3900000,
  });
  // [END example_data_two]
  return Promise.all([setSf, setLa]);
}

function getDocument(db) {
  // [START get_document]
  let cityRef = db.collection("cities").doc("SF");
  let getDoc = cityRef
    .get()
    .then((doc) => {
      if (doc.data().name === "San Francisco") {
        console.log("Test data saved!");
      } else {
        console.log("Something went wrong");
      }
    })
    .catch((err) => {
      console.log("Error getting document", err);
    });
  // [END get_document]

  return getDoc;
}

async function deleteTestDocuments(db) {
  const testData = db.collection("cities");
  const querySnapshot = await testData.get();
  querySnapshot.forEach(function (doc) {
    doc.ref.delete();
  });
  const postDeleteSnapshot = await testData.get();
  if (!postDeleteSnapshot.exists) {
    console.log("Test data is deleted!");
  } else {
    console.log("Test data is not deleted");
  }
}

(async function test(db) {
  await exampleDataTwo(db);
  await getDocument(db);
  await deleteTestDocuments(db);
})(db);
