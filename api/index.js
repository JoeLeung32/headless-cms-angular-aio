import { app } from "#src/app.js";
import { xApiTokenVerify } from "#src/db.js";
import { adminApis } from "#admin/index.js";
import { userApis } from "#user/index.js";
import { queryApis } from "#src/q/index.js";

app.use(async (req, res, next) => {
  const ignoreURL = ["/api/q"];
  const BreakException = {};
  try {
    ignoreURL.forEach((url) => {
      if (req.url.search(url) >= 0) throw BreakException;
    });
    await xApiTokenVerify(req, res, next);
  } catch (e) {
    if (e !== BreakException) throw e;
    next();
  }
});

app.use("/api/admin", adminApis());
app.use("/api/user", userApis());
app.use("/api/q", queryApis());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("mySqlLite listening on port 3000!");
});
