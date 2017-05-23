import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  nickname: { type: String, required: true },
  portrait: { type: String, required: true },
  last_modified: { type: Date, default: Date.now }
})

export default mongoose.model("Manager", managerSchema);