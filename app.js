const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./config/config");

const swaggerUI = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
let swaggerDocument;
try {
  swaggerDocument = YAML.parse(fs.readFileSync("./api/api.docs.yml", "utf8"));
} catch (error) {
  console.log(error);
}

if (swaggerDocument) {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
}

const port = process.env.PORT || 3000;

const indexRouter = require("./routes/index.route");

db.then(() => console.log("Database connected")).catch((err) =>
  console.log(err)
);

app.use(cors());
app.use(express.json());
app.use(indexRouter);
app.get("/", (req, res) => {
  res.send(`
    <h1>Furnivul Server</h1>
    <a href="/api-docs">Check Documentations</a><hr/>
    Check <a href="https://github.com/naufalalief/furnivul-server">Github</a> for updates
  `);
});
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
