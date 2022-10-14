const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')
const checkAuth = require('../controllers/ToughtController').checkAuth
//controller

router.get('/dashboard', checkAuth ,ToughtController.dashboard)//VER O ERRO NO MIDDLEWARE
router.get('/', ToughtController.showToughts)

module.exports = router 
