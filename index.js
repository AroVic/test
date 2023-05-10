const express = require("express");
const database = require("./includes/config/db");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3600;

// app.use((req, res, next) => {
//   req.db = db;
//   next();
// });

// connect to database
database.connectToDb();

//set static files folder
app.use(express.static("public"));
app.use("/services/images", express.static("uploads/images"));

//conditionally serving assets
// app.use("/abc", function (req, res, next) {
//   const b = req.query.i;
//   if (b == "cs") {
//     express.static("uploads/images")(req, res, next);
//   } else {
//     next();
//   }
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//routes
app.get("/", async (req, res) => {
  res.send("server is up and running!");
});

//importing routes
const servicesRouter = require("./includes/routes/services");

app.use("/services", servicesRouter);

process.on("SIGINT", async () => {
  await database.client.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log("server is running at http://localhost:" + port);
});
