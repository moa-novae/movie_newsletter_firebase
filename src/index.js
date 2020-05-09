import express from "express";
import 'dotenv/config';
import * as admin from "firebase-admin";

const app = express();

app.listen(3000, () => console.log("Example app listening on port 3000!"));
