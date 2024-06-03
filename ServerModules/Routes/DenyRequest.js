const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.post('/DenyRequest',  async (req, res) => {

    let IDSolicitacao = req.body.idsolicitacao; // ID da Solicitacao

    DB.Solicitacoes.update({ StatusPedido: 'Solicitação Negada' }, { where: { id: IDSolicitacao } }); // Atualizando o status da solicitação

    res.redirect('/Service/' + IDSolicitacao); // Redirecionando para o perfil do Cuidadoso

});

module.exports = router