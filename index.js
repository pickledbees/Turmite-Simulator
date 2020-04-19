const express = require("express");
const path = require("path");
const PORT = 8080;

const app = express();

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.use("/scripts", express.static("scripts"));
app.use("/styles", express.static("styles"));

app.listen(PORT, () => console.log("running server on port " + PORT));
