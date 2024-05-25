const bcrypt = require("bcryptjs");
const DB = require("../DatabaseModels/DatabaseModels");
const express = require('express');
const router = express.Router();


router.post('/cadastrocuidadoso', (req, res) => {

    //DADOS DO FORMULARIO
    let imagemBuffer = require('./public/js/imgpadrao'); // Pegando a imagem padrao
    let nomeCuidadoso = req.body.nome; // Nome do Cuidadoso
    let email = req.body.email; // Email do Cuidadoso
    let senha = req.body.senha; // Senha do Cuidadoso
    let cpf = req.body.cpf; // CPF do Cuidadoso
    let diaria = req.body.Diaria; // Diaria do Cuidadoso
    let confirmacaosenha = req.body.confirmacaosenha; // Confirmação da Senha do Cuidadoso
    let formacao = req.body.formacao; // Formação do Cuidadoso
    let datanascimento = req.body.datanascimento; // Data de Nascimento do Cuidadoso
    let genero = req.body.genero; // Gênero do Cuidadoso
    let celular = req.body.celular; // Celular do Cuidadoso
    let descricao = `Olá, eu sou ${nomeCuidadoso}, e estou à sua inteira disposição para oferecer cuidados excepcionais`; // Descrição Padrão do Cuidadoso
    let imagemantecedentes = req.body.imagemantecedentes; // Imagem de Antecedentes do Cuidadoso
    let estado = req.body.estado; // Estado
    let cidade = req.body.cidade; // Cidade
    let bairro = req.body.bairro; // Bairro
    let rua = req.body.rua; // Rua
    let numero = req.body.numero; // Número  
    let complemento = req.body.complemento; // Complemento
    let referencia = req.body.referencia; // Referência


    //CONFIGURAÇÃO DA CRIPTOGRAFIA
    const salt = bcrypt.genSaltSync(10); // Gerando o Salt para a CRIPTOGRAFIA
    let hash = bcrypt.hashSync(senha, salt); // Criando uma mistura da SENHA e o Salt
    let tokenhash = bcrypt.hashSync(email, salt); // Criando o primeiro Token do Cuidadoso


    DB.Cadastros.findAll({ where: { Email: email }, raw: true }).then(existencia => {

        if (existencia == null) { // Verificando se o Cuidadoso existe
            res.redirect('/');
        }
        else { // Se o Cuidadoso existir
            if (senha == confirmacaosenha) {

                if (estado == undefined) { // Verificando se o estado foi selecionado ( Porque no formulario de cadastro de cliente não possui o campo de estado)

                    DB.Cadastros.create({
                        Nome: nomeCuidadoso, CPF: cpf, Email: email, TipoConta: 'Cliente', Senha: hash, Token: tokenhash, DataNacimento: datanascimento, Genero: genero,
                        Celular: celular, FotoPerfil: imagemBuffer
                    });

                    res.redirect('/login'); // Redirecionando para a Home

                }
                else { // Se o estado foi selecionado e porque o tipo de cadastro e de Cuidadoso
                    DB.Cadastros.create({
                        Nome: nomeCuidadoso, CPF: cpf, Email: email, TipoConta: 'CuidadosoAspirante', Senha: hash, Token: tokenhash, Formacao: formacao, DataNacimento: datanascimento, Genero: genero,
                        Celular: celular, Diaria: diaria, FotoPerfil: imagemBuffer, BonsAntecedentes: imagemantecedentes, Estado: estado, Cidade: cidade, Bairro: bairro, Rua: rua,
                        Numero: numero, Complemento: complemento, Referencia: referencia, descricao: descricao
                    });

                    res.redirect('/login');

                }
            }
        }
    });
});

module.exports = router