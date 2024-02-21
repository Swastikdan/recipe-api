import { MongoClient } from "mongodb";
const connectionString = process.env.mongodburi || "";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}
let db = conn.db("recipe");
export default db;
