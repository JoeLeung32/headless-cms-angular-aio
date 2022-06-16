import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";

const statement = {
  tokenCancel: "UPDATE AdministratorToken SET isValid = ? WHERE token = ?",
};

export const panelLogout = container(async (req, res) => {
  const accessToken = req.headers?.authorization.substring(7).trim();
  let db;
  let values = { tokenCancel: [] };

  db = dbConnect();
  values.tokenCancel = [false, accessToken];

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(statement.tokenCancel, values.tokenCancel, (err, row) => {
          if (err) reject(err);
          resolve(true);
        });
      });
    });

  try {
    await query();
    db.close();
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    db.close();
    res.status(401).json({
      code: err.code,
      message: err.message,
    });
  }
});
