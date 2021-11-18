// import "chart.js";
import "./scss/main.scss";
import "jquery";
import { createDatabase } from "./app";

createDatabase()
  .then(() => {
    console.log("Database created sucessfully");
  })
  .catch(() => {
    console.log("Something went wrong");
  });
