import mongoose from "mongoose";
const Schema = mongoose.Schema;

// const newUserDoc = {
//     eAddr : address,
//     username : address,
//     roles: ['user'],
//     name : "Anonymous",
//     bio : "",
//     pfp : "",
//     nonce : ""
// };

const userSchema = new Schema({
  eAddr: {
    type: String,
  },
  username: {
    type: String,
  },
  roles: {
    type: Array,
  },
  name: {
    type: String,
  },
  bio: {
    type: String,
  },
  pfp: {
    type: String,
  },
  nonce: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);
