import express from "express";
import {Manager} from "../models";

const router = express.Router();


router.get("/login", (req, res, next) => {
    if (req.session.manager) return res.redirect("/");
    res.render("login.html");
});

router.post("/login", (req, res, next) => {
    const {username, password, issave} = req.body
    Manager
        .findOne({
            username: username
        })
        .then(manager => {
            if (!manager) {
                return res.json({
                    err_code: 1
                })
            }

            if (password !== manager.password) {
                return res.json({
                    err_code: 1
                })
            }

            // 登陆成功，通过 Session 记录登陆状态
            req.session.manager = "isLiving";
            const user = {
                username: manager.username,
                nickname: manager.nickname,
                portrait: manager.portrait,
                last_modified: manager.last_modified.getTime()
            }
            res.cookie("user", JSON.stringify(user));
            if (issave) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7 // 设置当前客户端登陆过期时间
                res.cookie("user", JSON.stringify(user), {
                    maxAge: 1000 * 60 * 60 * 24 * 7
                })
            }
            manager.last_modified = new Date();
            return manager.save();
        })
        .then((result) => {
            res.json({
                err_code: 0
            })
        })
});


export default router;