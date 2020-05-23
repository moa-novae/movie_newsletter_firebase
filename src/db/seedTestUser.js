import { db } from "./initialize";

export default function setTestUsers() {
  const usersRef = db.collection("users");
  const testUsers = [{email: process.env.testEmail, userName: process.env.testUserName}]
  const sets = testUsers.map((user) => {
    usersRef.add(user);
  });
  return Promise.all(sets);
}