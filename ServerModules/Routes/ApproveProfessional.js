const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');

router.post('/ApproveProfessional', (req, res) => {

    let IDCuidadoso = req.body.idcuidadoso; // Recebendo o ID do Cuidadoso
    let IDLogado = req.session.userId; // Recebendo o ID do Logado

    DB.Cadastros.findOne({ where: { id: IDLogado } }).then(adm => {

        if (adm.TipoConta == 'Administrador') { // Se for Administrador

            DB.Cadastros.update({ TipoConta: 'Cuidadoso' }, { where: { id: IDCuidadoso } }); // Atualizando o Cuidadoso

            res.redirect('/ProfilePage/' + IDLogado); // Redirecionando para o Perfil

        } else {
            res.redirect('/ProfilePage/' + IDCuidadoso); // Redirecionando para o Perfil
        }
    });
});

module.exports = router
