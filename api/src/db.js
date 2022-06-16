import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

export const dbConnect = () => {
  return new sqlite.Database(process.env.DB_FILE);
};

export const xApiTokenVerify = async (req, res, next) => {
  let db;
  let token;
  const errMsg = {
    code: "Access Denied",
    message: "Api Token incorrect.",
  };
  const xApiToken = req.headers["x-api-token"];
  const query = async (token) =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        const sql = "SELECT token FROM ApiToken WHERE token = ? LIMIT 1";
        db.get(sql, token, (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    });
  if (xApiToken) {
    db = dbConnect();
    token = xApiToken.trim();
    try {
      const data = await query(token);
      db.close();
      if (data) {
        next();
        return;
      }
    } catch (err) {
      db.close();
    }
  }
  return res.status(403).json(errMsg);
};
