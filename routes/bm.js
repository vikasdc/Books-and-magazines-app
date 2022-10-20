const express = require("express")
const bmController = require("../controllers/bm")
const router = express.Router()


router.get("/", bmController.getIndex)

router.get('/book&magazine', bmController.getAllbms)

router.get('/sortedbm', bmController.getAllSortedbms)

router.post('/findbm', bmController.findBookandMagazine)

router.post('/exportcsv', bmController.exportRandom_bm)

module.exports = router
