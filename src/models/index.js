import mongoose from "mongoose";
import Manager from "./manager";
import Blog from "./blog";
import Img from "./img";
import Classify from "./classify";

mongoose.connect("mongodb://localhost/edu");

export {
    Manager,
    Blog,
    Img,
    Classify
}
