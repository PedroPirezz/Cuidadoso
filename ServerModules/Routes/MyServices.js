const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.get('/MyServices', (req, res) => {

    let IDlogado = req.session.userId; //Pegando o ID de quem está logado


    DB.Solicitacoes.findAll({ where: { IDCuidadoso: IDlogado }, order: [['createdAt', 'DESC']] }).then(minhassolicitacoes => {
        res.render('JobOffersPage.ejs', { minhassolicitacoes: minhassolicitacoes, logado: IDlogado });
    });

});

module.exports = router