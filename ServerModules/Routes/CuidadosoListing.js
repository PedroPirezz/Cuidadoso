
const connection = require('../../Database/Database');
const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');


router.get('/CuidadosoListing', (req, res) => {

    let filtro = req.query.estado; // Filtro por estado
    let cidade = req.query.cidade; // Filtro por Cidade


    if (filtro) { // Verificando se o filtro  de estado existe
        if (cidade) { // Verificando se o filtro de cidade existe

            DB.Cadastros.findAll({ where: { TipoConta: 'Cuidadoso', Estado: filtro, Cidade: cidade }, order: connection.random() }).then(cadastro => {
                res.render('CuidadososListingPage.ejs', { cadastro: cadastro }); // Renderizando
            });

        }
        else // Se o filtro de Cidade não existir
        {

            DB.Cadastros.findAll({ where: { TipoConta: 'Cuidadoso', Estado: filtro }, order: connection.random() }).then(cadastro => {
                res.render('CuidadososListingPage.ejs', { cadastro: cadastro }); // Renderizando
            });

        }
    }
    else // Se não existir o filtro
    {
        DB.Cadastros.findAll({ where: { TipoConta: 'Cuidadoso' }, order: connection.random() }).then(cadastro => {
            module.exports = cadastro; // Exportando
            res.render('CuidadososListingPage.ejs', { cadastro: cadastro }); // Renderizando
        });
    }
});

module.exports = router