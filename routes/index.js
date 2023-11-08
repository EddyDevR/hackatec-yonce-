var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Vinder App", style: "/stylesheets/entry.css" });
});

module.exports = router;