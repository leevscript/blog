import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  describe: { type: String, required: false },
  complete: { type: String, required: true },
  last_modified: { type: Date, default: Date.now },
  file: { type: String, required: true }
})

export default mongoose.model("Blog", blogSchema);