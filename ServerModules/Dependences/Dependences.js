const connection = require('./Database/database');
const Cadastros = require('./Database/Cadastros');
const Posts = require('./Database/Posts');
const Enderecos = require('./Database/Enderecos');
const Solicitacoes = require('./Database/Solicitacoes');
const Financeiro = require('./Database/Financeiro');
const Chat = require('./Database/Chat');

module.exports = {
  connection,
  Cadastros,
  Posts,
  Enderecos,
  Solicitacoes,
  Financeiro,
  Chat
}