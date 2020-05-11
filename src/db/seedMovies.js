import { db } from "./initialize";

export default function setMovies(movieArr) {
  const moviesRef = db.collection("movies");
  const sets = movieArr.map((movie) => {
    moviesRef.doc(`${movie.id}`).set(movie);
  });
  return Promise.all(sets);
}
