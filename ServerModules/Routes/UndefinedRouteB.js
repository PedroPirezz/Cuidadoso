const express = require('express');
const router = express.Router();

router.get('/CadastroValor1', (req, res) => {

    let loginvar = 2;
    res.render('LoginPage.ejs', { loginvar: loginvar });
});

module.exports = router