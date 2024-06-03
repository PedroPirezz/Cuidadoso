const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');

router.post('/UpdateDaily',  (req, res) => {

    let novadiaria = req.body.novadiaria; //Pegando as informações do formulário
    let perfil = req.body.idperfil; //Peganod o id do perfil do Cuidadoso

    DB.Cadastros.update({ Diaria: novadiaria }, { where: { id: perfil } }).then(res.redirect(`/ProfilePage/${perfil}`)); //Atualizando o valor cobrado pelo Cuidadoso
});

module.exports = router