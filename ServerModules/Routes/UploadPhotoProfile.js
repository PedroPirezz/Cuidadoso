const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');
const multer = require('multer'); // Importando o Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/ChangeProfilePhoto', upload.single('imagem'), async (req, res) => {

    let IDPerfil = req.body.id; // ID do Perfil
    const imagem = req.file.buffer; // Dados binários da imagem
    const certo = imagem.toString('base64'); // Codificando a imagem

    DB.Cadastros.update({ FotoPerfil: certo }, { where: { id: IDPerfil } }).then(

        // Atualizando a imagem no BD
        res.redirect('/ProfilePage/' + IDPerfil + '') // Redirecionando para o perfil
    );
});

module.exports = router
