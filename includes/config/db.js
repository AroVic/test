const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const database = {
  ObjectId,
  db: "this is db property",
  client: "this is client property",
  connectToDb: function () {
    //console.log(this.client, this.db);
    this.client = new MongoClient(process.env.DB_URL);
    this.db = this.client.db(process.env.DB_NAME);
  },
};
module.exports = database;
