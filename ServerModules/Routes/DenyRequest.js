const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.post('/negarsolicitacao',  async (req, res) => {

    let IDSolicitacao = req.body.idsolicitacao; // ID da Solicitacao

    DB.Solicitacoes.update({ StatusPedido: 'Solicitação Negada' }, { where: { id: IDSolicitacao } }); // Atualizando o status da solicitação

    res.redirect('/servico/' + IDSolicitacao); // Redirecionando para o perfil do Cuidadoso

});

module.exports = router