
const DB = require("../DatabaseModels/DatabaseModels");
const express = require('express');
const router = express.Router();

router.post('/PaymentMade',  async (req, res) => {

    let IDSolicitacao = req.body.idsolicitacao; // Recebendo o ID da Solicitacao

    DB.Financeiro.update({ Status: 'Pago' }, { where: { IDSolicitacao: IDSolicitacao } }); // Atualizando o Financeiro

    res.redirect('/Service/' + IDSolicitacao); // Redirecionando para o Servico


});

module.exports = router
