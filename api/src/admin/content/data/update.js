import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { passwordCrypt } from "#utils/bcrypt.js";

const statement = {
  contentDataUpdate:
    "UPDATE ContentData SET " +
    "title = ?, " +
    "content = ?, " +
    "updateAt = ? " +
    "WHERE id = ?",
};

export const contentDataUpdate = container(async (req, res) => {
  let db;
  let id;
  let title;
  let content;

  if (!req || !req.body) {
    res.sendStatus(400);
    return;
  }

  id = req.body?.id;
  title = req.body?.title;
  content = req.body?.content;
  if (!id || !title) {
    res.sendStatus(400);
    return;
  }

  db = dbConnect();

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          statement.contentDataUpdate,
          [title, content, new Date().toISOString(), id],
          (err) => {
            if (err) reject(err);
            resolve({
              id,
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
