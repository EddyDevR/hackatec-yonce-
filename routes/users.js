var express = require("express");
const { send } = require("express/lib/response");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/webs", function (req, res, next) {
  res.render("chat", {
    title: "Accessaid - Chat",
    style: "/stylesheets/chat.css",
    script:"/Scripts/respuestas.js"
  });

});

router.get("/webs2", function (req, res, next) {
  res.render("chat", {
    title: "Accessaid - Chat",
    style: "/stylesheets/chat.css",
    script:"/Scripts/respuestas2.js"
  });

});

module.exports = router;
