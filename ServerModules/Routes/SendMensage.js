
const DB = require("../DatabaseModels/DatabaseModels");
const express = require('express');
const router = express.Router();


router.post('/EnviarMensagem',  (req, res) => {

    let Mensagem = req.body.Mensagem;
    let IDRemetente = req.body.IDRemetente;
    let IDServico = req.body.IDServico;
    let dataAtual = new Date().toLocaleDateString('pt-BR');
    let horarioAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });


    DB.Chat.create({
        IDRemente: IDRemetente,
        NomeRemetente: req.session.userName,
        IDServico: IDServico,
        Mensagem: Mensagem,
        Data: dataAtual,
        Horario: horarioAtual,
        Status: "Enviado",
    });

    res.redirect('/servico/' + IDServico);

});


module.exports = router