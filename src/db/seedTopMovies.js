import { db } from "./initialize";

export default function seedTopMovies(moviesArr) {
  const usersRef = db.collection("topMovies");

  const sets = moviesArr.map((user) => {
    usersRef.add(user);
  });
  return Promise.all(sets);
}
