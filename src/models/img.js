import mongoose from "mongoose";

const imgSchema = new mongoose.Schema({
  title: { type: String, required: true },
  describe: { type: String, required: false },
  last_modified: { type: Date, default: Date.now },
  base64: { type: String, required: true },
  file: { type: String, required: true }
})

export default mongoose.model("Img", imgSchema);