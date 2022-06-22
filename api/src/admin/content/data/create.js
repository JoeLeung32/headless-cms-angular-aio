import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { passwordCrypt } from "#utils/bcrypt.js";

const statement = {
  lastInsertId: "SELECT last_insert_rowid() as id",
  contentDataCreate:
    "INSERT INTO ContentData(title, content, contentObject, createAt) VALUES (?,?,?,?)",
};

export const contentDataCreate = container(async (req, res) => {
  let db;
  let title;
  let content;
  let contentObject;

  if (!req || !req.body) {
    res.sendStatus(400);
    return;
  }

  title = req.body?.title;
  content = req.body?.content;
  contentObject = req.body?.contentObject;
  if (!title || !contentObject) {
    res.sendStatus(400);
    return;
  }

  if (contentObject) {
    const valid = /^[A-Za-z\d_.-]+$/.exec(contentObject);
    if (!!!valid) {
      res.sendStatus(400);
      return;
    }
  }

  db = dbConnect();

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          statement.contentDataCreate,
          [title, content, contentObject, new Date().toISOString()],
          (err) => {
            if (err) reject(err);
          }
        );
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
