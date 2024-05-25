const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {

  let Status = ""

  res.render('LoginPage.ejs', { loginvar: 0, Status: Status })
})

module.exports = router