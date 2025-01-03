const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Connect to the active database (MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB (Active Database) connected");

    // Connect to the archived database (MONGO_Arch)
    const archConnection = await mongoose.createConnection(
      process.env.MONGO_Arch,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB (Archived Database) connected");

    // Return the archive connection so you can use it elsewhere
    return archConnection;
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
