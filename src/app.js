import express from "express";
import path from "path";
import proxy from "express-http-proxy";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import nunjucks from "nunjucks";

import config from "./config";
import errLog from "./middlewares/error-log";
import mountRouter from "./middlewares/mount-router";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
  secret: "leev",
  resave: false,
  saveUninitialized: true
}));

app.use("/api", proxy("https://api.douban.com"));


app.use("/static", express.static(config.static_path));


nunjucks.configure(config.views_path, {
  autoescape: true,
  express: app,
  noCache: true
});

app.use((req, res, next) => {
  if (req.path === "/login") {
    return next();
  }
  if (!req.session.manager) {
    return res.redirect("/login");
  }
  next();
});

app.get("/logout", (req, res, next) => {
	req.session.destroy();
	return res.redirect("/login");
});

app.use(express.static(config.views_path));


mountRouter.configure(path.join(__dirname, "routes"), {
  express: app
});

app.use((req, res, next) => {
  res.render("error.html");
})

app.use(errLog);

app.listen(80, () => {
	console.log("server is runing");
});