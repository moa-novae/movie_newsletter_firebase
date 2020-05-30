require("dotenv").config();
import schedule from "node-schedule";
import fetchFilters from "../db/fetchFilters";
import sendEmail from "./sendEmail";
import axios from "axios";
import moment from "moment";
import generateEmail from "./generateEmail";

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
  const threeMonthFuture = moment().add(3, "M").format("YYYY-MM-DD");
  if (match === "all") {
    const castsStr = castIdsArr?.join("") || "";
    const genresStr = genreIdsArr?.join("") || "";
    const companiesStr = companyIdsArr?.join("") || "";
    const directorsStr = directorIdsArr?.join("") || "";
    const output = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&primary_release_date.lte=${threeMonthFuture}&with_cast=${castsStr}&with_genres=${genresStr}&with_companies=${companiesStr}&with_crew=${directorsStr}`
    );

    return output.data.results;
  }
  if (match === "any") {
    const castsStr = castIdsArr.join("|") || "";
    const genresStr = genreIdsArr?.join("|") || "";
    const companiesStr = companyIdsArr?.join("|") || "";
    const directorsStr = directorIdsArr?.join("|") || "";
    const finalResults = [];
    if (castsStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&primary_release_date.lte=${threeMonthFuture}&with_cast=${castsStr}`
      );
      finalResults.push(...output.data.results);
    }
    if (genresStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&primary_release_date.lte=${threeMonthFuture}&with_genres=${genresStr}`
      );
      for (const result of output.data.results) {
        if (finalResults.every((finalResult) => finalResult.id !== result.id)) {
          finalResults.push(result);
        }
      }
    }
    if (companiesStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&primary_release_date.lte=${threeMonthFuture}&with_companies=${companiesStr}`
      );
      for (const result of output.data.results) {
        if (finalResults.every((finalResult) => finalResult.id !== result.id)) {
          finalResults.push(result);
        }
      }
    }
    if (directorsStr) {
      const output = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=${currentDate}&primary_release_date.lte=${threeMonthFuture}&with_crew=${directorsStr}`
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
  const filterResult = await discoverMovies(
    castIdsArr,
    genreIdsArr,
    companyIdsArr,
    directorIdsArr,
    match
  );
  return { name: filter.name, results: filterResult };
}

async function recommendMoviesForUser(userFilters) {
  //All filters
  const email = userFilters.email;
  const filters = userFilters.filters;
  const allFiltersResults = Object.values(filters).map((filter) => {
    if (filter.enabled) {
      return getResultsForOneFilter(filter);
    } else {
      return { name: filter.name, results: null };
    }
  });

  const moviesForUser = await Promise.all(allFiltersResults);
  //transform to correct strucuture for handlebar template
  function transformToEmailContext(filter) {
    if (filter.results) {
      return filter.results.map((result) => ({
        imagePath: result["poster_path"]
          ? "https://image.tmdb.org/t/p/original/" + result["poster_path"]
          : "https://drive.google.com/uc?id=1VACVMbk6BHr1ae3JMYBHarXruWVn-whE",
        title: result.title,
        tag: result.overview,
      }));
    } else {
      return null;
    }
  }
  //looping through return results of user's filters
  let filterResults = [];
  for (const filter of moviesForUser) {
    filterResults.push({
      name: filter.name,
      results: transformToEmailContext(filter),
    });
  }
  return { email, filterResults };
}

export default async function sendNewsletter() {
  const users = await fetchFilters();
  const fetchUsersMovies = users.map((users) => recommendMoviesForUser(users));
  const usersMovies = await Promise.all(fetchUsersMovies);
  for (const user of usersMovies) {
    const msg = generateEmail(user);
    sendEmail(msg);
  }
}
//send newsletter every month 
function sendMonthlyNewsletter() {
  schedule.scheduleJob({ hour: 6, date: 1 }, function () {
    sendNewsletter();
  });
}

sendMonthlyNewsletter();
