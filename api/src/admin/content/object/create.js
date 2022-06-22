import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { passwordCrypt } from "#utils/bcrypt.js";

const statement = {
  lastInsertId: "SELECT last_insert_rowid() as id",
  contentObjectCreate:
    "INSERT INTO ContentObject(object_name, object_catalog) VALUES (?,?)",
};

export const contentObjectCreate = container(async (req, res) => {
  let db;
  let values = { contentObjectCreate: [] };
  let object_name;
  let object_catalog;

  if (!req || !req.body) {
    res.sendStatus(400);
    return;
  }

  object_name = req.body?.objectName;
  object_catalog = req.body?.objectCatalog;
  if (!object_name) {
    res.sendStatus(400);
    return;
  }

  if (object_name) {
    const valid = /^[A-Za-z\d_.-]+$/.exec(object_name);
    if (!!!valid) {
      res.sendStatus(400);
      return;
    }
  }

  if (object_catalog) {
    const valid = /^[A-Za-z\d_.-]+$/.exec(object_catalog);
    if (!!!valid) {
      res.sendStatus(400);
      return;
    }
  }

  db = dbConnect();
  values.contentObjectCreate = [object_name, object_catalog];

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          statement.contentObjectCreate,
          values.contentObjectCreate,
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
    const responses = {
      id: data.id,
      name: object_name,
    };
    db.close();
    if (object_catalog) {
      responses.catalog = object_catalog;
    }
    res.status(200).json({
      status: "success",
      data: responses,
    });
  } catch (err) {
    db.close();
    res.status(400).json({
      code: err.code,
      message: err.message,
    });
  }
});
