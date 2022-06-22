import { nanoid } from "nanoid";
import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { passwordCrypt, passwordCompare } from "#utils/bcrypt.js";

const statement = {
  tokenCheck:
    "SELECT token, expiryAt FROM AdministratorToken WHERE token = ? AND isValid = 1 LIMIT 1",
  tokenUpdate: "UPDATE AdministratorToken SET expiryAt = ? WHERE token = ?",
};

export const panelGuard = container(async (req, res) => {
  const accessToken = req.headers?.authorization.substring(7).trim();
  const expiry = new Date();
  let db;
  let values = { tokenCheck: [], tokenUpdate: [] };
  let rejectReason = {
    code: "Access Denied",
    message: "",
  };

  expiry.setTime(expiry.getTime() + 60 * 60 * 1000);
  db = dbConnect();
  values.tokenCheck = [accessToken];
  values.tokenUpdate = [expiry.toISOString(), accessToken];

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(statement.tokenCheck, values.tokenCheck, (err, row) => {
          if (err) reject(err);
          if (!row) {
            rejectReason.message = "Access Token not valid.";
            reject(rejectReason);
            return;
          }
          db.run(statement.tokenUpdate, values.tokenUpdate, (err, row) => {
            if (err) reject(err);
            resolve({
              expiry: expiry.toISOString(),
            });
          });
        });
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
    res.status(401).json({
      code: err.code,
      message: err.message,
    });
  }
});
