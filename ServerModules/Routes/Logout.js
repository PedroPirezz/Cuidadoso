
const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {

    req.session.isLoggedIn = false; // Verificando se o Usuário Esta Logado
    req.session.token = ''; // Esvazinando o Token
    req.session.destroy(); // Destruindo a Sessão

    res.redirect('/'); // Redirecionando para o Home

});

module.exports = router