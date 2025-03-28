const bcrypt = require("bcryptjs");
const DB = require("../DatabaseModels/DatabaseModels");
const express = require("express");
const router = express.Router();
const session = require('express-session');


router.post('/LoginValidate', (req, res) => {

    let email = req.body.email; //Pegando as informações do formulário
    let senha = req.body.senha; //Pegando as informações do formulário
    let Status = "";


    const salt = bcrypt.genSaltSync(10); // Definindo a configuração do algoritmo de criptografia



    DB.Cadastros.findOne({ where: { Email: email } }).then(cadastros => {

        if (cadastros) { // Caso o usuário exista

            let testelogin = bcrypt.compareSync(senha, cadastros.Senha); // Verificando se a senha esta correta

            if (cadastros && testelogin == true) { // Caso a senha esteja correta


                let token = bcrypt.hashSync(email, salt); // Gerando um token baseado no email


                cadastros.update({ Token: token }); // Atualizando o token

                req.session.isLoggedIn = true; //Guardando na sessão que o usuário está logado
                req.session.userName = cadastros.Nome; // Guardando na sessão o nome do usuário
                req.session.userId = cadastros.id; // Guardando na sessão o ID do usuário
                req.session.token = cadastros.Token; // Guardando na sessão o Token do usuário
                req.session.TipoConta = cadastros.TipoConta; // Guardando na sessão o Tipo de Conta do usuário
                console.log("Logado com sucesso! Bem vindo " + cadastros.Nome);
                res.redirect('/');

            }
            else { //Se a senha estiver errada
                Status = "Email ou Senha Incorretos";
                res.render('LoginPage.ejs', { loginvar: 0, Status: Status });
            }
        } else { //Se o usuário não existir
            Status = "Usuario não cadastrado";
            res.render('LoginPage.ejs', { loginvar: 0, Status: Status });
        }


    });

});
module.exports = router