require("dotenv").config();
import fetchFilters from "../db/fetchFilters";
import axios from "axios";
import moment from "moment";

async function getIdOfCasts(castArr) {
  const fetchIdPromises = castArr.map((cast) =>
    axios.get(
      `https://api.themoviedb.org/3/search/person?api_key=${
        process.env.tmdbKey
      }&query=${encodeURI(cast)}&page=1&include_adult=false`
    )
  );
  const castsArr = await Promise.all(fetchIdPromises);
  let castIdsArr = [];
  castsArr.forEach((cast) => {
    castIdsArr.push(cast.data.results[0].id);
  });
  return castIdsArr;
}
async function getIdOfCompany(companyArr) {
  const fetchIdPromises = companyArr.map((company) =>
    axios.get(
      `https://api.themoviedb.org/3/search/company?api_key=${
        process.env.tmdbKey
      }&query=${encodeURI(company)}&page=1&include_adult=false`
    )
  );
  const companiesArr = await Promise.all(fetchIdPromises);
  let companyIdsArr = [];
  companiesArr.forEach((company) => {
    companyIdsArr.push(company.data.results[0].id);
  });
  return companyIdsArr;
}

async function discoverMovies(
  castIdsArr,
  genreIdsArr,
  companyIdsArr,
  directorIdsArr,
  match
) {
  const currentDate = moment().format("YYYY-MM-DD");
  if (match === "all") {
    const castsStr = castIdsArr?.join("") || null;
    const genresStr = genreIdsArr?.join("") || null;
    const companiesStr = companyIdsArr?.join("") || null;
    const directorsStr = directorIdsArr?.join("") || null;
    const output = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&with_cast=${castsStr}&with_genres=${genresStr}&with_companies=${companiesStr}&with_crew=${directorsStr}`
    );
    return output.data.results;
  }
  if (match === "any") {
    const castsStr = castIdsArr.join("|") || null;
    const genresStr = genreIdsArr?.join("|") || null;
    const companiesStr = companyIdsArr?.join("|") || null;
    const directorsStr = directorIdsArr?.join("|") || null;
    const finalResults = [];
    if (castsStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&with_cast=${castsStr}`
      );
      finalResults.push(...output.data.results);
    }
    if (genresStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&with_genres=${genresStr}`
      );
      for (const result of output.data.results) {
        if (finalResults.every((finalResult) => finalResult.id !== result.id)) {
          finalResults.push(result);
        }
      }
    }
    if (companiesStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&with_companies=${companiesStr}`
      );
      for (const result of output.data.results) {
        if (finalResults.every((finalResult) => finalResult.id !== result.id)) {
          finalResults.push(result);
        }
      }
    }
    if (directorsStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&with_crew=${directorsStr}`
      );
      for (const result of output.data.results) {
        if (finalResults.every((finalResult) => finalResult.id !== result.id)) {
          finalResults.push(result);
        }
      }
    }
    //sort by popularity desc
    finalResults.sort((a, b) => b.popularity - a.popularity);
    return finalResults;
  }
}

async function getResultsForOneFilter(filter) {
  let castIdsArr;
  let genreIdsArr;
  let companyIdsArr;
  let directorIdsArr;
  const match = filter.match;
  if (filter.cast) {
    castIdsArr = await getIdOfCasts(filter.cast);
    // console.log("castIdsArr", castIdsArr);
  }
  if (filter.genre) {
    genreIdsArr = filter.genre;
  }
  if (filter.productionCompany) {
    companyIdsArr = await getIdOfCompany(filter.productionCompany);
  }
  if (filter.director) {
    directorIdsArr = await getIdOfCasts(filter.director);
  }
  return discoverMovies(
    castIdsArr,
    genreIdsArr,
    companyIdsArr,
    directorIdsArr,
    match
  );
}

function recommendMoviesForUser(userFilters) {
  //All filters
  const email = userFilters.email;
  const filters = userFilters.filters;
  const allFiltersResults = Object.values(filters).map(getResultsForOneFilter);

  Promise.all(allFiltersResults).then((val) => console.log("second", val));
}

export default async function recommendMovies() {
  const userFiltersArr = await fetchFilters();

  recommendMoviesForUser(userFiltersArr[0]);
}
recommendMovies();
