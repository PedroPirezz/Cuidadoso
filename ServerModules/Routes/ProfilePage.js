
const DB = require("../DatabaseModels/DatabaseModels");
const express = require('express');
const router = express.Router();

const mesesDoAno = {
    1: { nome: "Janeiro", dias: 31 },
    2: { nome: "Fevereiro", dias: 29 }, // Pode atualizar este valor para 29 em anos bissextos
    3: { nome: "Março", dias: 31 },
    4: { nome: "Abril", dias: 30 },
    5: { nome: "Maio", dias: 31 },
    6: { nome: "Junho", dias: 30 },
    7: { nome: "Julho", dias: 31 },
    8: { nome: "Agosto", dias: 31 },
    9: { nome: "Setembro", dias: 30 },
    10: { nome: "Outubro", dias: 31 },
    11: { nome: "Novembro", dias: 30 },
    12: { nome: "Dezembro", dias: 31 },
};



router.get('/perfil/:id', (req, res) => {

    const dataAtual = new Date(); // Modulo de Data
    const numeroDoMesAtual = dataAtual.getMonth() + 1; // Mes Atual

    let TipoContaLogado = req.session.TipoConta; // Pegando o Tipo de Conta logado

    let IDPerfil = req.params.id; // Pegando o ID do Perfil

    DB.Cadastros.findOne({ where: { id: IDPerfil } }).then(cadastro => {

        if(cadastro.TipoConta == 'Cliente'){
            res.redirect('/Contrate');
        }

      

        if (cadastro) { // Se o Perfil existir



            DB.Posts.findAll({ order: [['id', 'DESC']], raw: true, where: { IDCadastro: IDPerfil } }).then(posts => {

                if (TipoContaLogado == 'Administrador') { // Se o Perfil for Administrador

                    DB.Cadastros.findAll({ where: { TipoConta: 'CuidadosoAspirante' } }).then(aspirantes => {

                        res.render('ProfilePage.ejs', { cadastro: cadastro, posts: posts, agenda: mesesDoAno[numeroDoMesAtual], aspirantes: aspirantes });

                    });

                }
                else { // Se o Perfil Não for Administrador

                    DB.Solicitacoes.findAll({ raw: true, where: { IDCuidadoso: IDPerfil, StatusPedido: 'Solicitação Aceita' } }).then(solicitacoes => {

                        res.render('ProfilePage.ejs', { cadastro: cadastro, solicitacoes: solicitacoes, posts: posts, agenda: mesesDoAno[numeroDoMesAtual] }); // Renderizando

                    });
                }
            });


        } else { // Se o Perfil não existir

            res.redirect('/contrate'); // Redirecionando para a Home

        }
    });
});

module.exports = router
