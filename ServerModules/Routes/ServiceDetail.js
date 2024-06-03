
const DB = require("../DatabaseModels/DatabaseModels");
const express = require('express');
const router = express.Router();


router.get('/Service/:id',  (req, res) => {

    let IDLogado = req.session.userId; // ID de quem está logado
    let IDServico = req.params.id; // ID do Servico


    DB.Solicitacoes.findOne({ where: { id: IDServico } }).then(servico => {

     

        DB.Cadastros.findOne({ where: { id: servico.IDCuidadoso } }).then(cuidadoso => {

            DB.Cadastros.findOne({ where: { id: IDLogado } }).then(contratante => {

                DB.Financeiro.findOne({ where: { IDCuidadoso: IDLogado, Status: 'Pendente' } }).then(financeiro => {

                    DB.Chat.findAll({ where: { IDServico: IDServico }, order: [['id', 'ASC']] }).then(chat => {

                        res.render('ServiceDetailsPage.ejs', { servico: servico, cuidadoso: cuidadoso, logado: IDLogado, contratante: contratante, financeiro: financeiro, chat: chat }); // Renderizando
                    });
                });
            });
        });
    });
});

module.exports = router;