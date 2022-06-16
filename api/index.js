import { app } from "#src/app.js";
import { xApiTokenVerify } from "#src/db.js";
import { adminApis } from "#admin/index.js";

app.use(xApiTokenVerify);

app.use("/api/admin", adminApis());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("mySqlLite listening on port 3000!");
});
