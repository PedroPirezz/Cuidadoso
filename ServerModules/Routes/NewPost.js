const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');
const { route } = require('./Home');
const multer = require('multer'); // Importando o Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/uploadpost', upload.single('imagem'), async (req, res) => {
    //Modulos de Data
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Note que janeiro é 0
    const ano = data.getFullYear();

    // Formatando para o formato desejado (DD/MM/AAAA)
    let data1 = `${dia}/${mes}/${ano}`;

    let id = req.body.id;
    let assunto = req.body.assunto;

    const { nome, descricao } = req.body;
    const imagem = req.file.buffer; // Dados binários da imagem


    let idcerto = id[0];

    DB.Cadastros.findOne({ where: { id: idcerto } }).then(cadastro => {




        const certo = imagem.toString('base64');




        DB.Posts.create({ IDCadastro: idcerto, NomeCadastro: cadastro.Nome, Data: data1, Assunto: assunto, Foto: certo });

        res.redirect('/Perfil/' + idcerto);
    });
});

module.exports = router;