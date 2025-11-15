import mongoose from "mongoose";

const connectToMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to MongoDB");
  } catch (error) {
    console.log(
      "Error connection to mongoDB: MONGO_URI not provided in env || ",
      error.message
    );
  }
};

export default connectToMongoose;
