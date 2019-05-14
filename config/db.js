const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://aa1aac:username@cluster0-xt6ob.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true }
  )
  .then(() => console.log("connected to Mongo Server"))
  .catch(err => console.log(err));
