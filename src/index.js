import express from "express";
import * as bodyParser from "body-parser";


const app = express();

app.listen(3000, () => console.log("Example app listening on port 3000!"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
