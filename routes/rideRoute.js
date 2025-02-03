const express = require("express");
const {ride, requestedrides, acceptride} = require("../controllers/rideController");
const router = express.Router()

router.post('/', ride)
router.get('/', requestedrides)
router.get('/', acceptride);

module.exports = router;