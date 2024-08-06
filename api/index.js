const router = require("express").Router();

const receipts = require("./receipts");

router.use("/receipts", receipts);

module.exports = router;
