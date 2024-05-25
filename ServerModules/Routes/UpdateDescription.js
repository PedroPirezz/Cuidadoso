const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.post('/updatedescri', (req, res) => {

    let IDPerfil = req.body.idperfil;
    let NovaDescri = req.body.novadescri;

    DB.Cadastros.update({ descricao: NovaDescri }, { where: { id: IDPerfil } });

    res.redirect(`/Perfil/${IDPerfil}`);

});

module.exports = router
