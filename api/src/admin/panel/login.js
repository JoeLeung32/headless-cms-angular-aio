import { nanoid } from "nanoid";
import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { passwordCompare } from "#utils/bcrypt.js";

const statement = {
  accountValidate:
    "SELECT id, username, password FROM Administrator WHERE username = ? LIMIT 1",
  tokenCancel: "UPDATE AdministratorToken SET isValid = ? WHERE adminId = ?",
  tokenCreate:
    "INSERT INTO AdministratorToken(adminId, token, createAt, expiryAt, isValid) VALUES (?,?,?,?,?)",
};

export const panelLogin = container(async (req, res) => {
  let db;
  let values = { accountValidate: [], tokenCancel: [], tokenCreate: [] };
  let username;
  let password;
  let rejectReason = {
    code: "Access Denied",
    message: "",
  };
  if (!req || !req.body) {
    res.sendStatus(400);
    return;
  }
  username = req.body?.username;
  password = req.body?.password;
  if (!username || !password) {
    res.sendStatus(400);
    return;
  }

  db = dbConnect();
  values.accountValidate = [username];

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(
          statement.accountValidate,
          values.accountValidate,
          async (err, row) => {
            if (err) reject(err);
            const now = new Date();
            const expiry = new Date();
            expiry.setTime(expiry.getTime() + 60 * 60 * 1000);
            const accessToken = nanoid(256);
            const accountData = row;
            const isValidLogin = await passwordCompare(
              password,
              accountData.password
            );
            if (!isValidLogin) {
              rejectReason.message = "Password incorrect.";
              reject(rejectReason);
              return;
            }
            values.tokenCancel = [false, accountData.id];
            values.tokenCreate = [
              accountData.id,
              accessToken,
              now.toISOString(),
              expiry.toISOString(),
              true,
            ];
            db.run(statement.tokenCancel, values.tokenCancel);
            db.run(statement.tokenCreate, values.tokenCreate);
            resolve({
              id: accountData.id,
              accessToken: accessToken,
              effective: now.toISOString(),
              expiry: expiry.toISOString(),
            });
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
    res.status(401).json({
      code: err.code,
      message: err.message,
    });
  }
});
