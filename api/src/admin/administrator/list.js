import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";

const statement = {
  accountList: "SELECT * FROM Administrator ORDER BY id DESC",
};

export const administratorList = container(async (req, res) => {
  let db = dbConnect();

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        const data = [];
        db.each(
          statement.accountList,
          (err, row) => {
            if (err) reject(err);
            data.push(row);
          },
          async (err, length) => {
            if (err) reject(err);
            resolve(data);
          }
        );
      });
    });

  try {
    const data = await query();
    db.close();
    res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  } catch (err) {
    db.close();
    res.status(400).json({
      code: err.code,
      message: err.message,
    });
  }
});
