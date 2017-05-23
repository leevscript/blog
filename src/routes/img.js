import express from "express";
import formidable from "formidable";
import path from "path";
import fs from "fs";

import { Img } from "../models";
import config from "../config";

const router = express.Router();

router.get("/img", (req, res, next) => {
  const page = Number.parseInt(req.query.page);
  const pageSize = Number.parseInt(req.query.pageSize);
  Img
    .find()
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

router.get("/img/count", (req, res, next) => {
  Img.count((err, count) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0,
      result: count
    })
  })
});

router.delete("/img/:id", (req, res, next) => {
  Img
    .findById(req.params.id)
    .then(function (result) {
        fs.unlinkSync(path.join(config.img_path, result.file));
        Img
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

router.post("/img", (req, res, next) => {
	const form = new formidable.IncomingForm();
  	form.uploadDir = config.img_path; // 配置 formidable 文件上传接收路径
    form.keepExtensions = true; // 配置保持文件原始的扩展名
    form.parse(req, (err, fields, files) => {
      if (err) next(err);
      new Img({
        title: fields.title,
        describe: fields.describe,
        base64: fields.base64,
        file: path.basename(files.file.path),
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

export default router;