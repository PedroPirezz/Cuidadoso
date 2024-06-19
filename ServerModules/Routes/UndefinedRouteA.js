const express = require('express');
const router = express.Router();

router.get('/UndefinedRouteA', (req, res) => {

    let loginvar = 1; //Variavel que indica se o usuario está querendo fazer login ou cadastro

    res.render('LoginPage.ejs', { loginvar: loginvar });
});

module.exports = router