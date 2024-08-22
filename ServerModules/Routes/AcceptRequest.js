const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');

router.post('/AcceptRequest', async (req, res) => {

    let idsolicitacao = req.body.idsolicitacao; // ID da Solicitacao
    let idcuidadoso = req.body.idcuidadoso; // ID do Cuidadoso
    let dataAtual = new Date(); // Obtendo o dia, mês e ano
    let dia = dataAtual.getDate().toString().padStart(2, '0'); // Pegando o dia
    let mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Pegando o mês
    let ano = dataAtual.getFullYear().toString(); // Pegando o ano
    let dataFormatada = `${dia}/${mes}/${ano}`; // Formatando a data

    let ValorTaxa
    DB.Cadastros.findOne({ where: { id: idcuidadoso } }).then(Profissional => {
        let ValorDaDiaria = Profissional.Diaria;
        ValorTaxa = (ValorDaDiaria * 0.1);
    });

    DB.Solicitacoes.findOne({ where: { id: idsolicitacao } }).then(solicitacao => {
        DB.Financeiro.create({ IDCuidadoso: idcuidadoso, IDSolicitacao: idsolicitacao, NomeCuidadoso: solicitacao.NomeCuidadoso, DataAceitacao: dataFormatada, ValoraPagar: ValorTaxa, ValorTotal: solicitacao.Valor, Status: 'Pendente' }); //
        DB.Solicitacoes.update({ StatusPedido: 'Solicitação Aceita' }, { where: { id: idsolicitacao } }); // Atualizando o status da solicitação
        res.redirect('/Service/' + idsolicitacao); // Redirecionando para o perfil do Cuidadoso
    });

});

module.exports = router