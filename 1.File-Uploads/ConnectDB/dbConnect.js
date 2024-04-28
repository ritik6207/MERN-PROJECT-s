const mongoose = require("mongoose");

// Connect to mongoDB
const connect = mongoose
  .connect("mongodb://localhost:27017/image-upload")
  .then(() => {
    console.log("DB connected");
  })
  .catch(e => console.log(e));


module.exports = connect;