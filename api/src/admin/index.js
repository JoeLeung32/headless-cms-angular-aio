import express from "express";
import multer from "multer";

import { panelLogin } from "#admin/panel/login.js";
import { panelLogout } from "#admin/panel/logout.js";
import { panelGuard } from "#admin/panel/guard.js";

import { administratorList } from "#admin/administrator/list.js";
import { administratorCreate } from "#admin/administrator/create.js";

const router = express.Router();
const upload = multer();

export const adminApis = () => {
  // Panel
  router.post("/panel/login", upload.none(), panelLogin);
  router.get("/panel/logout", panelLogout);
  router.get("/panel/guard", panelGuard);

  // Administrator
  router.get("/administrator/list", upload.none(), administratorList);
  router.post("/administrator/create", upload.none(), administratorCreate);
  // router.post("/administrator/update", upload.none(), administratorCreate);
  return router;
};
