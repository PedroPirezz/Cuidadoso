
const DB = require('../DatabaseModels/DatabaseModels');
const express = require("express");
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



router.get('/HireProfessional', (req, res) => {

    const hoje = new Date(); //Modulo de Data
    const DiaDeHoje = hoje.getDate(); //Pegando o dia de hoje
    var mesAtual = hoje.getMonth() + 1; // Pegando o mes de hoje
    var mes = mesesDoAno[mesAtual].nome; //Pegando o nome do mes
    var diasMes = mesesDoAno[mesAtual].dias; //Pegando os dias do mes
    let idCuidadoso = req.query.cuidadoso; //Pegando o ID do Cuidadoso
    let idlogado = req.session.userId; //Pegando o ID de quem está logado


    DB.Cadastros.findOne({ where: { id: idCuidadoso } }).then(cuidadosocontratado => {
        DB.Enderecos.findAll({ where: { IDCadastro: idlogado } }).then(enderecos => {
            DB.Solicitacoes.findAll({ where: { IDCuidadoso: idCuidadoso, MesAgendado: mes } }).then(DiasIndisponieis => {

                res.render('HireProfessionalPage.ejs', { contratado: cuidadosocontratado, enderecos: enderecos, DiaDeHoje: DiaDeHoje, mes: mes, diasMes: diasMes, DiasIndisponieis: DiasIndisponieis });
            });
        });
    });
});
module.exports = router;