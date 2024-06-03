const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');
const { route } = require('./Home');

router.get('/Pay/:idservico',  (req, res) => {

    let IDServico = req.params.idservico; // Pegando o ID do serviço

    DB.Solicitacoes.findOne({ where: { id: IDServico } }).then(minhassolicitacoes => {
        DB.Financeiro.findOne({ where: { IDSolicitacao: IDServico } }).then(financeiro => {

            res.render('CheckoutPage.ejs', { minhassolicitacoes: minhassolicitacoes, financeiro: financeiro }); // Renderizando o Pagamento
        });
    });

});
module.exports = router