import "dotenv/config";
import setGenres from "../db/seedGenres";
import setMovies from "../db/seedMovies";
import setTestUsers from '../db/seedTestUser'
import axios from "axios";

(async function initializeGenres() {
  try {
    const output = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.tmdbKey}&language=en-US`
    );
    // console.log(output.data.genres)
    setGenres(output.data.genres);
  } catch (e) {
    console.log(e);
  }
});

//two api calls to different tmdb api routes are needed to gather all the info of a movie needed
(async function initializeMonthlyMovies() {
  async function fetchAdditionalMovieInfo(id) {
    const output = await axios.get(`
    https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.tmdbKey}&language=en-US
    `);
    return output.data;
  }
  //FIRST API CALL
  try {
    let pageNumber = 1;
    const movies = [];
    const output = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=${pageNumber}&primary_release_date.gte=2020-05-12&primary_release_date.lte=2020-06-12`
    );
    //find total pages of results that is available on tmdb
    let totalPages = output.data["total_pages"];
    //push the movies obj on first page to an array
    for (let movie of output.data.results) {
      movies.push(movie);
    }

    //call the rest of the result pages and push to movies array
    const moviesAfterPageOne = [];
    for (let i = 2; i <= totalPages; i++) {
      moviesAfterPageOne.push(
        axios
          .get(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.tmdbKey}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=${i}&primary_release_date.gte=2020-05-12&primary_release_date.lte=2020-06-12`
          )
          .then((output) => {
            for (let movie of output.data.results) {
              movies.push(movie);
            }
          })
      );
    }
    await Promise.allSettled(moviesAfterPageOne);
    const movieObjs = [];
    //Once all basic movie info is aquired from tmdb, get additional info such as production company from tmdb api (details)
    //SECOND API CALL
    Promise.allSettled(
      movies.map((movie) =>
        fetchAdditionalMovieInfo(movie.id).then((additionalInfo) => ({
          ...movie,
          ...additionalInfo,
        }))
      )
    ).then((movies) => {
      for (let movie of movies) {
        movieObjs.push(movie.value);
      }
      //send the completed movie jsons to firebase
      setMovies(movieObjs);
    });

    // setMovies(output.data.results);
  } catch (e) {
    console.log(e);
  }
});
(async function initializeUsers () {
  await setTestUsers()
  console.log('Test users set!')
})()