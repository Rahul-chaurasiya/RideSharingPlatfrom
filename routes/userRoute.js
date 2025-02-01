const express = require("express")
const { Default, getUsers, signup, login, update, logout } = require("../controllers/userController")

const router = express.Router()

router.get('/', Default)
router.get('/users', getUsers)
router.post('/signup', signup)
router.post('/login', login)
router.put('/edit', update)
router.get('/logout', logout)
module.exports = router;   