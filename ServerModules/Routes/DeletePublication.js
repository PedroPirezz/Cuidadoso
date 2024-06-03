const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');

router.post('/DeletePost',  (req, res) => {

    let IdPost = req.body.idpost; // Pegando o ID do Post
    let IdCuidadoso = req.body.idperfil; // Pegando o ID do Cuidadoso

    DB.Posts.destroy({ where: { id: IdPost } }); // Deletando o Post

    res.redirect(`/ProfilePage/${IdCuidadoso}`); // Redirecionando para o perfil do Cuidadoso
});

module.exports = router