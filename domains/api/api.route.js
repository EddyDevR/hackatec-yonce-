var express = require("express");
let apiRouter = express.Router();
let apiController = require('./api.controller')


let dotenv = require("dotenv")

dotenv.config();

/* GET /api/v1/ */
apiRouter.get('/', apiController.root);

module.exports = apiRouter;