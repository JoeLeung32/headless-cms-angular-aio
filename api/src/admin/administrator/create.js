import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { passwordCrypt } from "#utils/bcrypt.js";

const statement = {
  lastInsertId: "SELECT last_insert_rowid() as id",
  accountCreate:
    "INSERT INTO Administrator(username, password, createAt) VALUES (?,?,?)",
};

export const administratorCreate = container(async (req, res) => {
  let db;
  let values = { accountCreate: [] };
  let username;
  let password;
  let passwordHashed;

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

  if (username) {
    const valid = /^[a-z0-9_.]+$/.exec(username);
    if (!!!valid) {
      res.sendStatus(400);
      return;
    }
  }

  passwordHashed = await passwordCrypt(password);

  db = dbConnect();
  values.accountCreate = [username, passwordHashed, new Date().toISOString()];

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(statement.accountCreate, values.accountCreate, (err) => {
          if (err) reject(err);
        });
        db.get(statement.lastInsertId, (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    });

  try {
    const data = await query();
    db.close();
    res.status(200).json({
      status: "success",
      data: {
        id: data.id,
        username,
      },
    });
  } catch (err) {
    db.close();
    res.status(400).json({
      code: err.code,
      message: err.message,
    });
  }
});
