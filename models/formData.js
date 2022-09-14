const mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/node-react-api',{ useNewUrlParser: true },{ useUnifiedTopology: true });

const formSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const formmodel = mongoose.model("user", formSchema);
module.exports = formmodel;
