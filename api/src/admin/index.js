import express from "express";
import multer from "multer";

import { panelGuard } from "#admin/administrator/guard.js";
import { panelLogin } from "#admin/administrator/login.js";
import { panelLogout } from "#admin/administrator/logout.js";
import { administratorCreate } from "#admin/administrator/create.js";

const router = express.Router();
const upload = multer();

export const adminApis = () => {
  router.get("/panel/guard", panelGuard);
  router.post("/panel/login", upload.none(), panelLogin);
  router.get("/panel/logout", panelLogout);
  router.post("/administrator/create", upload.none(), administratorCreate);
  return router;
};
