import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";
import { contentObjectCreate } from "#admin/content/object/create.js";

const statement = {
  contentObjectList:
    "SELECT *, object_name AS objectName, object_catalog AS objectCatalog FROM ContentObject ORDER BY id DESC",
};

export const contentObjectList = container(async (req, res) => {
  let db = dbConnect();

  const query = async () =>
    new Promise((resolve, reject) => {
      db.serialize(() => {
        const data = [];
        db.each(
          statement.contentObjectList,
          (err, row) => {
            if (err) reject(err);
            data.push({
              id: row.id,
              objectName: row.objectName,
              objectCatalog: ["null", ""].includes(row.objectCatalog)
                ? null
                : row.objectCatalog,
            });
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
