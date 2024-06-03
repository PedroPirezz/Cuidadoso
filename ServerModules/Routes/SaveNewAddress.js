const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.post('/SaveAddress',  (req, res) => {

    let Estado = req.body.estado; //Pegando as informações do formulário
    let Cidade = req.body.cidade; //Pegando as informações do formulário
    let Bairro = req.body.bairro; //Pegando as informações do formulário
    let Rua = req.body.rua; //Pegando as informações do formulário
    let Numero = req.body.numero; //Pegando as informações do formulário
    let Complemento = req.body.complemento; //Pegando as informações do formulário
    let Referencia = req.body.referencia; //Pegando as informações do formulário
    let idPerfil = req.body.idcontrato; //Pegando as informações do formulário
    let idlogado = req.session.userId; //Pegando as informações do formulário

    DB.Enderecos.create({
        IDCadastro: idlogado,
        Estado: Estado,
        Cidade: Cidade,
        Bairro: Bairro,
        Rua: Rua,
        Numero: Numero,
        Complemento: Complemento,
        Referencia: Referencia,
    });


    res.redirect('/HireProfessional?cuidadoso=' + idPerfil); //Redirecionando para o perfil do Cuidadoso

});

module.exports = router;
