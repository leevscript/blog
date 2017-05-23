import express from "express";
import formidable from "formidable";
import path from "path";
import fs from "fs";

import {Blog, Classify} from "../models";
import config from "../config";

const router = express.Router();

router.get("/blogs", (req, res, next) => {
    const complete = req.cookies.complete ? req.cookies.complete.split("\"")[1] : /.*/;
    const type = req.cookies.type ? req.cookies.type.split("\"")[1] : /.*/;
    const page = Number.parseInt(req.query.page);
    const pageSize = Number.parseInt(req.query.pageSize);
    Blog
        .find({
            complete: complete,
            type: type
        })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .then((result) => {
            res.json({
                err_code: 0,
                result: result
            })
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/blogs/count", (req, res, next) => {
    const result = {};

    Blog
        .count()
        .then((count) => {
            result.all = count;
            return Blog.count({complete: "publish"})
        })
        .then((count) => {
            result.publish = count;
            return Blog.count({complete: "unpublish"})
        })
        .then((count) => {
            result.unpublish = count;
            return Blog.count({complete: "draft"})
        })
        .then((count) => {
            result.draft = count;
            res.json({
                err_code: 0,
                result: result
            })
        })
});


router.post("/blogs", (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.md_path; // 配置 formidable 文件上传接收路径
    form.keepExtensions = true; // 配置保持文件原始的扩展名
    form.parse(req, (err, fields, files) => {
        if (err) next(err);
        new Blog({
            title: fields.title,
            name: fields.name,
            type: fields.type,
            complete: fields.complete,
            describe: fields.describe,
            file: path.basename(files.file.path)
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
    });
});

router.post("/blogs/edit", (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = config.md_path;
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) next(err);
        Blog
            .findById(fields.id)
            .then((result) => {
                fs.unlinkSync(path.join(config.md_path, result.file));

                let fileName;
                if (files.file.size) {
                    fileName = files.file.path;
                } else {
                    fs.unlinkSync(files.file.path);
                    fileName = path.join(config.md_path, (new Date().getTime() + ".md"))
                    fs.writeFile(fileName, fields.markdown, function (err) {
                        if (err) next(err);
                    })
                }

                result.title = fields.title;
                result.name = fields.name;
                result.type = fields.type;
                result.complete = fields.complete;
                result.describe = fields.describe;
                result.file = path.basename(fileName);

                return result.save();
            })
            .then((result) => {
                res.json({
                    err_code: 0
                })
            })
            .catch((err) => {
                next(err);
            });
    })
});

router.get("/blogs/markdown/:id", (req, res, next) => {
    Blog
        .findById(req.params.id)
        .then((result) => {
            fs.readFile(path.join(config.md_path, result.file), "utf8", function (err, data) {
                if (err) next(err);
                res.json({
                    err_code: 0,
                    blog: result,
                    data: data
                })
            });
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/blogs/:_id", (req, res, next) => {
    Blog
        .findById(req.params._id)
        .then((result) => {
            res.json({
                err_code: 0,
                result: result
            })
        })
        .catch((err) => {
            next(err);
        });
});

router.delete("/blogs/:id", (req, res, next) => {
    Blog
        .findById(req.params.id)
        .then(function (result) {
            fs.unlinkSync(path.join(config.md_path, result.file));
            Blog
                .remove({_id: req.params.id})
                .then((result) => {
                    res.json({
                        err_code: 0
                    });
                })
                .catch((err) => {
                    next(err);
                });
        });

});

router.post("/blogs/build", (req, res, next) => {
    const mdname = new Date().getTime() + ".md";
    const fileName = path.join(config.md_path, mdname);
    fs.writeFile(fileName, req.body.markdown, function (err) {
        if (err) next(err);
        res.json({
            err_code: 0,
            result: mdname
        })
    })
})

router.post("/classify", (req, res, next) => {
    Classify
        .findOne({value: req.body.value})
        .then((result) => {
            if (result) {
                res.json({
                    err_code: 1
                })
            } else {
                new Classify({
                    value: req.body.value
                })
                    .save()
                    .then((result) => {
                        res.json({
                            err_code: 0,
                            result: result
                        })
                    })
                    .catch((err) => {
                        res.json({
                            err_code: 500,
                            result: err
                        })
                    })
            }
        })

})

router.get("/classify", (req, res, next) => {
    Classify
        .find()
        .then(function (result) {
            res.json({
                err_code: 0,
                result: result
            })
        })
        .catch((err) => {
            res.json({
                err_code: 500,
                result: err
            })
        })
})

router.delete("/classify", (req, res, next) => {
    Classify
        .remove({_id: req.query.id})
        .then(function (result) {
            res.json({
                err_code: 0
            })
        })
        .catch((err) => {
            res.json({
                err_code: 500
            })
        })
})


export default router;