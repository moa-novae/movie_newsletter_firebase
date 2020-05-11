import { db } from "./initialize";

export default function setGenres(genreArr) {
  const genresRef = db.collection("genres");
  const sets = genreArr.map((genre) => {
    // console.log(genre.id);
    genresRef.doc(`${genre.id}`).set({ id: genre.id, name: genre.name });
  });
  return Promise.all(sets);
}
