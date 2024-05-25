const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.get('/Historico',  (req, res) => {

    let IDlogado = req.session.userId; //Pegando o ID de quem está logado 

    DB.Solicitacoes.findAll({ where: { IDSolicitante: IDlogado }, order: [['createdAt', 'DESC']] }).then(minhassolicitacoes => {
        res.render('MyCareRequestsPage.ejs', { minhassolicitacoes: minhassolicitacoes, logado: IDlogado }); // Renderizando o Historico
    });

});
module.exports = router