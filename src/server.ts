import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
require('dotenv').config();


let server: Server;
let port = 5000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.cy3cu.mongodb.net/advanced-note-app?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Connected to MongoDB using Mongoose");
    server = app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
