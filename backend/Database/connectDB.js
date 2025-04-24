import mongoose from "mongoose"


export const connectDB = (mongo_uri) => 
  {
    mongoose.connect(mongo_uri).then(console.log("Connected Successfully to the database !")) 

  }