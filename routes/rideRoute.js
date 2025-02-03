const express = require("express");
const {ride} = require("../controllers/rideController");
const router = express.Router()

router.post('/', ride)

module.exports = router;