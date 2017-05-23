import express from "express";
import path from "path";
import gm from "gm";
import formidable from "formidable";
import {Manager} from "../models";
import config from "../config";

const router = express.Router();


router.post("/register", (req, res, next) => {
    Manager
        .findOne({
            username: req.body.username
        })
        .then(result => {
            if (result) {
                res.json({
                    err_code: 1
                })
            } else {
                new Manager({
                    username: req.body.username,
                    password: req.body.password,
                    nickname: req.body.nickname,
                    portrait: path.basename(req.body.portrait)
                })
                    .save()
                    .then((result) => {
                        res.json({
                            err_code: 0,
                            result: result
                        })
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        })


});

router.post("/getImg", (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.img_path;
    form.keepExtensions = true; //
    form.parse(req, (err, fields, files) => {
        if (err) next(err);

        res.json({
            err_code: 0,
            result: path.join("/static/upload_img", path.basename(files.file.path))
        })

    });
})

router.post("/cropper", (req, res, next) => {
    const {x, y, width, height, imgSrc} = req.body;
    const previewImgPath = path.join(config.img_path, path.basename(imgSrc));
    gm(previewImgPath)
        .crop(width, height, x, y)
        .write(previewImgPath, (err) => {
            if (err) {
                return next(err)
            }
            res.json({
                err_code: 0
            })
        })
})


export default router;
