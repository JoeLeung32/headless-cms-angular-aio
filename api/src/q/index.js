import express from "express";
import multer from "multer";

import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";

const router = express.Router();
const upload = multer();

const page = container(async (req, res) => {
  const object = req.params?.object;
  const sql = `
    SELECT *,
           ObjDB.id             AS objectId,
           ObjDB.object_name    AS objectName,
           ObjDB.object_catalog AS objectCatalog,
           DataDB.id            AS dataId
    FROM ContentObject ObjDB
           LEFT OUTER JOIN ContentData DataDB
                           ON object_name = contentObject OR object_catalog = contentObject
    WHERE contentObject = $keyword
       OR contentObject = $keyword
    ORDER BY DataDB.id DESC
  `;
  const rejectReason = {
    code: "Content not found.",
    message: "",
  };
  let db;

  if (!object) {
    res.sendStatus(400);
    return;
  }

  db = dbConnect();

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        const data = [];
        db.each(
          sql,
          {
            $keyword: object,
          },
          (err, row) => {
            if (err) reject(err);
            if (!row) {
              rejectReason.message = "Content object not found.";
              reject(rejectReason);
              return;
            }
            data.push(row);
          },
          async (err, length) => {
            if (err) reject(err);
            resolve(data);
          }
        );
      });
    });

  try {
    const data = await query();
    db.close();
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    db.close();
    res.status(400).json({
      code: err.code,
      message: err.message,
    });
  }
});

const catalog = container(async (req, res) => {
  const catalog = req.params?.catalog;
  const id = req.params?.id;
  const sql = `
    SELECT *,
           ObjDB.id             AS objectId,
           ObjDB.object_name    AS objectName,
           ObjDB.object_catalog AS objectCatalog,
           DataDB.id            AS dataId
    FROM ContentObject ObjDB
           LEFT OUTER JOIN ContentData DataDB
                           ON object_name = contentObject OR object_catalog = contentObject
    WHERE (contentObject = $keyword OR contentObject = $keyword) 
      AND dataId = $id
    ORDER BY DataDB.id DESC
  `;
  const rejectReason = {
    code: "Content not found.",
    message: "",
  };
  let db;

  if (!catalog || !id) {
    res.sendStatus(400);
    return;
  }

  db = dbConnect();

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        const data = [];
        db.each(
          sql,
          {
            $keyword: catalog,
            $id: id,
          },
          (err, row) => {
            if (err) reject(err);
            if (!row) {
              rejectReason.message = "Content object not found.";
              reject(rejectReason);
              return;
            }
            data.push(row);
          },
          async (err, length) => {
            if (err) reject(err);
            resolve(data);
          }
        );
      });
    });

  try {
    const data = await query();
    db.close();
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    db.close();
    res.status(400).json({
      code: err.code,
      message: err.message,
    });
  }
});

export const queryApis = () => {
  router.get("/:object", page);
  router.get("/:catalog/:id", catalog);
  return router;
};
