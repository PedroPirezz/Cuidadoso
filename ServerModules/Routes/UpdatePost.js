const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.post('/updatepost', (req, res) => {

    let idpost = req.body.idpost; // Recebendo o ID do Post
    let novoassunto = req.body.novoassunto; // Recebendo o novo Assunto
    let idperfil = req.body.idperfil; // Recebendo o ID do Perfil

    DB.Posts.update({ Assunto: novoassunto }, { where: { id: idpost } }); // Atualizando o Post

    res.redirect(`/Perfil/${idperfil}`); // Redirecionando para o Perfil

});

module.exports = router
