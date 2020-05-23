import { db } from "./initialize";

export default async function fetchFilters() {
  const snapshot = await db.collection("users").get();
  const usersArr = snapshot.docs.map((doc) => doc.data());
  // console.log("users", usersArr);
  return usersArr;
}
