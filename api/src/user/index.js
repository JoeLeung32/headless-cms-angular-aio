import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer();

export const userApis = () => {
  return router;
};
