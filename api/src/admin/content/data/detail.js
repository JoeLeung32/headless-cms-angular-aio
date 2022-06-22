import { dbConnect } from "#src/db.js";
import { container } from "#utils/util.js";

const statement = {
  contentDataPageDetail:
    "SELECT *, " +
    "ObjDB.id AS objectId, " +
    "ObjDB.object_name AS objectName, " +
    "ObjDB.object_catalog AS objectCatalog, " +
    "DataDB.id AS dataId " +
    "FROM ContentObject ObjDB " +
    "LEFT OUTER JOIN ContentData DataDB ON object_name = contentObject " +
    "WHERE object_name = $keyword " +
    "ORDER BY DataDB.id DESC " +
    "LIMIT 1",
  contentDataCatalogItems:
    "SELECT *, " +
    "ObjDB.id AS objectId, " +
    "ObjDB.object_name AS objectName, " +
    "ObjDB.object_catalog AS objectCatalog, " +
    "DataDB.id AS dataId " +
    "FROM ContentObject ObjDB " +
    "LEFT OUTER JOIN ContentData DataDB ON object_catalog = contentObject " +
    "WHERE object_catalog = $keyword " +
    "ORDER BY DataDB.id DESC",
  contentDataCatalogDetail:
    "SELECT *, " +
    "ObjDB.id AS objectId, " +
    "ObjDB.object_name AS objectName, " +
    "ObjDB.object_catalog AS objectCatalog, " +
    "DataDB.id AS dataId " +
    "FROM ContentObject ObjDB " +
    "LEFT OUTER JOIN ContentData DataDB ON object_catalog = contentObject " +
    "WHERE object_catalog = $keyword " +
    "AND DataDB.id = $contentDataId " +
    "ORDER BY DataDB.id DESC " +
    "LIMIT 1",
};

export const contentDataDetail = container(async (req, res) => {
  let db = dbConnect();
  let sql;
  let values;
  let contentDataId;
  let objectType;
  let promise;
  const rejectReason = {
    code: "Content not found.",
    message: "",
  };
  const promiseType = {
    single: (sql, values) =>
      new Promise((resolve, reject) =>
        db.serialize(() => {
          db.get(sql, values, (err, row) => {
            if (err) reject(err);
            if (!row) {
              rejectReason.message = "Content object not found.";
              reject(rejectReason);
              return;
            }
            resolve({
              id: row.objectId,
              objectName: row.objectName,
              objectCatalog: ["null", ""].includes(row.objectCatalog)
                ? null
                : row.objectCatalog,
              content: {
                id: row.dataId,
                title: row.title,
                content: row.content,
                createAt: row.createAt,
                updateAt: row.updateAt,
                isPublished: row.isPublished,
                contentObject: row.contentObject,
              },
            });
          });
        })
      ),
    multi: (sql, values) =>
      new Promise((resolve, reject) =>
        db.serialize(() => {
          const data = [];
          db.each(
            sql,
            values,
            (err, row) => {
              if (err) reject(err);
              if (!row) {
                rejectReason.message = "Content object not found.";
                reject(rejectReason);
                return;
              }
              if (row.objectId && row.dataId) {
                data.push({
                  id: row.objectId,
                  objectName: row.objectName,
                  objectCatalog: ["null", ""].includes(row.objectCatalog)
                    ? null
                    : row.objectCatalog,
                  content: {
                    id: row.dataId,
                    title: row.title,
                    content: row.content,
                    createAt: row.createAt,
                    updateAt: row.updateAt,
                    isPublished: row.isPublished,
                    contentObject: row.contentObject,
                  },
                });
              }
            },
            async (err, length) => {
              if (err) reject(err);
              resolve(data);
            }
          );
        })
      ),
  };

  if (!req || !req.body) {
    res.sendStatus(400);
    return;
  }

  contentDataId = 0;
  objectType = req.body?.contentType;

  switch (objectType) {
    case "page": {
      sql = statement.contentDataPageDetail;
      values = {
        $keyword: req.body?.contentObject,
      };
      promise = promiseType.single(sql, values);
      break;
    }
    case "catalog": {
      contentDataId = req.body?.contentDataId;
      sql = statement.contentDataCatalogItems;
      values = {
        $keyword: req.body?.contentCatalog,
      };
      promise = promiseType.multi(sql, values);

      if (contentDataId) {
        sql = statement.contentDataCatalogDetail;
        values.$contentDataId = contentDataId;
        promise = promiseType.single(sql, values);
      }
      break;
    }
    default: {
      res.sendStatus(400);
      return;
    }
  }

  const query = async () => promise;

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
