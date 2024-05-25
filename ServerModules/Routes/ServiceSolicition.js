const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');
const { Model } = require('sequelize');
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


router.post('/Solicitar', async (req, res) => {

    let dataAtual = new Date(); // Modulo para pegar a data


    // Obtendo o dia, mês e ano
    let dia = dataAtual.getDate();
    let mes = dataAtual.getMonth() + 1;
    let ano = dataAtual.getFullYear();
    var NomeMes = mesesDoAno[mes].nome; //Pegando o nome do mes


    // Formatando para o formato desejado (DD/MM/AAAA)
    let dataFormatada = `${dia}/${mes}/${ano}`;

    // Importando dados das inputs
    let Horadeinicio = req.body.HoraInicio;
    let enderecoSelecionado = req.body.endsa;
    let IdContratante = req.session.userId;
    let idcuidadoso = req.body.CuidadosoID;
    let DiaAtendimento = req.body.dia;
    let Deficiencia = req.body.Deficiencia;
    let Mensagem = req.body.Mensagem;
    let Status = "Solicitação Pendente";
    let horaformatada = Horadeinicio;
    if (Deficiencia.length == 0) { // Se deficiencia estiver vazia 
        Deficiencia = "Não possui deficiência";
    }
    DB.Enderecos.findOne({ where: { id: enderecoSelecionado } }).then(endereco => {

        DB.Cadastros.findOne({ where: { id: idcuidadoso } }).then(cadastro => {

            let Valor = cadastro.Diaria; // Pegando o valor da diaria do Cuidadoso
            let NomeCuidadoso = cadastro.Nome; // Nome do Cuidadoso

            DB.Cadastros.findOne({ where: { id: IdContratante } }).then(contratante => {

                DB.Solicitacoes.create({
                    DataCriacao: dataFormatada,
                    HoraAgendada: horaformatada,
                    IDSolicitante: IdContratante,
                    NomeSolicitante: contratante.Nome,
                    IDCuidadoso: idcuidadoso,
                    NomeCuidadoso: NomeCuidadoso,
                    DiaAtendimento: DiaAtendimento,
                    MesAgendado: NomeMes,
                    Deficiencia: Deficiencia,
                    Mensagem: Mensagem,
                    StatusPedido: Status,
                    Valor: Valor,
                    Estado: endereco.Estado,
                    Cidade: endereco.Cidade,
                    Bairro: endereco.Bairro,
                    Rua: endereco.Rua,
                    Numero: endereco.Numero,
                    Complemento: endereco.Complemento,
                    Referencia: endereco.Referencia
                }).then(() => {
                });
            });
        });
    });
    res.redirect('/Historico'); // Redirecionando para o Historico
});


module.exports = router