import { db } from "./initialize";

export default function setGenres(genreArr) {
  const genresRef = db.collection("genres");
  const genresDoc = {};
  genreArr.forEach((genre) => {
    genresDoc[genre.id] = { id: genre.id, name: genre.name };
  });
  return genresRef.doc("genres").set(genresDoc);
}
