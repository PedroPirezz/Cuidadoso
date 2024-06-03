const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.post('/UpdateDescription', (req, res) => {

    let IDPerfil = req.body.idperfil;
    let NovaDescri = req.body.novadescri;

    DB.Cadastros.update({ descricao: NovaDescri }, { where: { id: IDPerfil } });

    res.redirect(`/ProfilePage/${IDPerfil}`);

});

module.exports = router
