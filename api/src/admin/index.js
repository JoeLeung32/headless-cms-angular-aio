import express from "express";
import multer from "multer";

import { panelLogin } from "#admin/panel/login.js";
import { panelLogout } from "#admin/panel/logout.js";
import { panelGuard } from "#admin/panel/guard.js";

import { administratorList } from "#admin/administrator/list.js";
import { administratorCreate } from "#admin/administrator/create.js";

import { contentObjectList } from "#admin/content/object/list.js";
import { contentObjectCreate } from "#admin/content/object/create.js";
import { contentDataCreate } from "#admin/content/data/create.js";
import { contentDataUpdate } from "#admin/content/data/update.js";
import { contentDataDetail } from "#admin/content/data/detail.js";

const router = express.Router();
const upload = multer();

export const adminApis = () => {
  // Panel
  router.post("/panel/login", upload.none(), panelLogin);
  router.get("/panel/logout", panelLogout);
  router.get("/panel/guard", panelGuard);

  // Administrator
  router.get("/administrator/list", administratorList);
  router.post("/administrator/create", upload.none(), administratorCreate);

  // Content Object
  router.get("/content-object/list", contentObjectList);
  router.post("/content-object/create", upload.none(), contentObjectCreate);

  // Content Data
  router.post("/content-data/create", upload.none(), contentDataCreate);
  router.post("/content-data/update", upload.none(), contentDataUpdate);
  router.post("/content-data/detail", upload.none(), contentDataDetail);
  // router.post('/content-data/publish', )

  return router;
};
