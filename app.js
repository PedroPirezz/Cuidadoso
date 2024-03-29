
// Importando os módulos necessários
const express = require('express'); // Importando o Express
const bodyParser = require('body-parser'); // Importando o Body Parser
const axios = require('axios'); // Importando o Axios
const multer = require('multer'); // Importando o Multer
const session = require("express-session"); // Importando o Express Session
const bcrypt = require('bcryptjs'); // Importando o Bcrypt
const { Op } = require('sequelize'); // Importando o operador Sequelize
const { raw } = require('mysql2'); // Importando o Raw MySQL2
const { where } = require('sequelize'); // Importando o Where Sequelize

// Iniciando o Express
const app = express(); 

// Configurando o Body Parser para lidar com dados codificados no formato URL
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando o Express para utilizar EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Importando arquivos de banco de dados
const connection = require('./Database/database');
const Cadastros = require('./Database/Cadastros');
const Posts = require('./Database/Posts');
const Enderecos = require('./Database/Enderecos');
const Solicitacoes = require('./Database/Solicitacoes');
const Financeiro = require('./Database/Financeiro');

// Configurando o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configurando o armazenamento do Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Criando uma instância de roteador do Express
const router = express.Router();

//Criando uma sessão
app.use(session({
    secret: 'Cuidadoso',//É uma string que representa a chave secreta usada para assinar os cookies de sessão. Essa chave é usada para criptografar e descriptografar os dados armazenados na sessão, garantindo que apenas o servidor possa ler e escrever os dados da sessão. A chave secreta deve ser uma sequência de caracteres difícil de ser adivinhada e deve ser mantida em sigilo.
    resave: false, //É um valor booleano que indica se a sessão deve ser salva no servidor mesmo que não tenha sido modificada durante a requisição. Quando resave é false, a sessão só será salva se os dados da sessão foram modificados. Isso ajuda a evitar gravações desnecessárias no servidor e melhora a eficiência.
    saveUninitialized: true,//É um valor booleano que indica se a sessão deve ser salva no servidor, mesmo que não tenha sido inicializada. Quando saveUninitialized é true, a sessão será salva mesmo se ainda não tiver sido modificada, garantindo que uma sessão vazia seja criada para cada cliente. Isso é útil para evitar a criação de cookies desnecessários em algumas situações, mas você pode definir como false para economizar recursos se não precisar de sessões vazias.
    cookie: {
        expires: false //  É um objeto que permite definir configurações específicas para o cookie da sessão. Neste exemplo, estamos usando cookie.expires: false para fazer com que o cookie expire quando o navegador for fechado. Quando o navegador é fechado, o cookie é excluído e, portanto, a sessão também é invalidada. Se não definirmos essa propriedade ou atribuirmos uma data/hora de expiração, o cookie será armazenado em uma sessão de navegador (que geralmente dura até o usuário fechar o navegador) e a sessão permanecerá ativa mesmo que o usuário navegue para outras páginas e volte ao site.
    }
}));

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

// Conectando ao banco de dados
connection .authenticate()
    .then(() => {
        console.log("Conexão realizada com SUCESSO Com o Banco de Dados")
    })
    .catch((msgErr) => {
        console.log("ERRO NA CONEXÃO COM O BANCO DE DADOS")
    })

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userName = req.session.userName || null;
    res.locals.userId = req.session.userId || null;
    res.locals.token = req.session.token || null;
    res.locals.TipoConta = req.session.TipoConta
    next();
});

async function testartoken(req, res, next) {
    if (req.session.userId) {
        let usuario = req.session.userId
        let token = req.session.token

        let user = await Cadastros.findOne({
            where: { id: usuario }
        })

        if (user != undefined) {

            if (user.Token == token) {
                next();
            } else { res.redirect("/login") }

        } else { res.redirect("/login") }

    } else

        res.redirect("/login")
}

//ROTAS
app.get('/', (req, res) => {

    Posts.findAll({ limit: 9, order: [['id', 'DESC']], raw: true }).then(posts => { //Estou fazendo uma busca no Banco de dados e trazendo os 9 primeiros posts

        res.render('HomePage.ejs', { posts: posts })

    })
})

app.get('/login', (req, res) => {

    let Status = ""

    res.render('LoginPage.ejs', { loginvar: 0, Status: Status })
})



app.post('/validarlogin', (req, res) => { 

    let email = req.body.email //Pegando as informações do formulário
    let senha = req.body.senha //Pegando as informações do formulário
    let Status = ""


    const salt = bcrypt.genSaltSync(10) // Definindo a configuração do algoritmo de criptografia



    Cadastros.findOne({ where: { Email: email } }).then(cadastros => { // Verificando se o usuário existe

        if (cadastros) { // Caso o usuário exista

            let testelogin = bcrypt.compareSync(senha, cadastros.Senha) // Verificando se a senha esta correta

            if (cadastros && testelogin == true) { // Caso a senha esteja correta
             
                
                let token = bcrypt.hashSync(email, salt) // Gerando um token baseado no email

                cadastros.update({ Token: token }) // Atualizando o token

                req.session.isLoggedIn = true; //Guardando na sessão que o usuário está logado
                req.session.userName = cadastros.Nome; // Guardando na sessão o nome do usuário
                req.session.userId = cadastros.id; // Guardando na sessão o ID do usuário
                req.session.token = cadastros.Token; // Guardando na sessão o Token do usuário
                req.session.TipoConta = cadastros.TipoConta // Guardando na sessão o Tipo de Conta do usuário

                res.redirect('/')
                
            }
            else { //Se a senha estiver errada
                Status = "Email ou Senha Incorretos"
                res.render('LoginPage.ejs', { loginvar: 0, Status: Status })
            }
        } else { //Se o usuário não existir
            Status = "Usuario não cadastrado"
                res.render('LoginPage.ejs', { loginvar: 0, Status: Status })
        }


    })

})

app.get('/contratar', testartoken, (req, res) => {

const hoje = new Date(); //Modulo de Data
const DiaDeHoje = hoje.getDate(); //Pegando o dia de hoje
var mesAtual = hoje.getMonth() + 1; // Pegando o mes de hoje
var mes = mesesDoAno[mesAtual].nome; //Pegando o nome do mes
var diasMes = mesesDoAno[mesAtual].dias; //Pegando os dias do mes
let idCuidadoso = req.query.cuidadoso //Pegando o ID do Cuidadoso
  let idlogado = req.session.userId //Pegando o ID de quem está logado


    Cadastros.findOne({ where: { id: idCuidadoso } }).then(cuidadosocontratado => {  //Bucando o Cuidadoso que deseja contratar
        Enderecos.findAll({ where: { IDCadastro : idlogado } }).then(enderecos => { //Buscando os Endereços cadastrados de quem está logado
            Solicitacoes.findAll({ where: { IDCuidadoso: idCuidadoso, MesAgendado:mes } }).then(DiasIndisponieis => { //Buscando as solicitações feitas pelo Cuidadoso

        res.render('HireProfessionalPage.ejs', { contratado: cuidadosocontratado, enderecos: enderecos, DiaDeHoje: DiaDeHoje, mes: mes, diasMes: diasMes, DiasIndisponieis: DiasIndisponieis })
    })         
    })
    })
})

app.get('/CadastroValor', (req, res) => {

    let loginvar = 1 //Variavel que indica se o usuario está querendo fazer login ou cadastro

    res.render('LoginPage.ejs', { loginvar: loginvar })
})

app.post('/NovaDiaria', testartoken, (req, res) => {

    let novadiaria = req.body.novadiaria //Pegando as informações do formulário
    let perfil = req.body.idperfil //Peganod o id do perfil do Cuidadoso

    Cadastros.update({ Diaria: novadiaria }, { where: { id: perfil } }).then(res.redirect(`/perfil/${perfil}`)) //Atualizando o valor cobrado pelo Cuidadoso
})

app.post('/salvarendereco',  testartoken,(req, res) => {

    let Estado = req.body.estado //Pegando as informações do formulário
    let Cidade = req.body.cidade //Pegando as informações do formulário
    let Bairro = req.body.bairro //Pegando as informações do formulário
    let Rua = req.body.rua  //Pegando as informações do formulário
    let Numero = req.body.numero //Pegando as informações do formulário
    let Complemento = req.body.complemento //Pegando as informações do formulário
    let Referencia = req.body.referencia   //Pegando as informações do formulário
    let idPerfil = req.body.idcontrato //Pegando as informações do formulário
    let idlogado = req.session.userId //Pegando as informações do formulário

    Enderecos.create({ //Cadastrando o endereço no Banco de Dados

        IDCadastro: idlogado,
        Estado: Estado,
        Cidade: Cidade,
        Bairro: Bairro,
        Rua: Rua, 
        Numero: Numero,
        Complemento: Complemento,
        Referencia: Referencia,
    })


    res.redirect('/contratar?cuidadoso=' + idPerfil) //Redirecionando para o perfil do Cuidadoso

})

app.get('/CadastroValor1', (req, res) => {

    let loginvar = 2
    res.render('LoginPage.ejs', { loginvar: loginvar })
})

app.post('/deletarpubli', testartoken, (req, res) => {

    let IdPost = req.body.id // Pegando o ID do Post
    let IdCuidadoso = req.body.idperfil // Pegando o ID do Cuidadoso

    Posts.destroy({ where: { id: IdPost } }) // Deletando o Post

    res.redirect(`/Perfil/${IdCuidadoso}`) // Redirecionando para o perfil do Cuidadoso



})

app.get('/Historico',testartoken, (req, res) => {

let IDlogado = req.session.userId //Pegando o ID de quem está logado 

Solicitacoes.findAll({where: { IDSolicitante: IDlogado }, order: [['createdAt', 'DESC']]}).then(minhassolicitacoes => { //Pegando todas as solicitações feitas por quem está logado
    res.render('MyCareRequestsPage.ejs', { minhassolicitacoes: minhassolicitacoes, logado:IDlogado }); // Renderizando o Historico
  });
  
})

app.get('/MeusServicos',testartoken, (req, res) => {

    let IDlogado = req.session.userId //Pegando o ID de quem está logado
    
    
    Solicitacoes.findAll({where: {  IDCuidadoso: IDlogado}, order: [['createdAt', 'DESC']] }).then(minhassolicitacoes => { //Pegando todas as solicitações que solicitaram o Cuidadoso que esta logado
        res.render('JobOffersPage.ejs', { minhassolicitacoes: minhassolicitacoes, logado:IDlogado });
      });
      
    })
 
app.get('/Pagamento/:idservico', testartoken, (req, res) => {

    let IDServico = req.params.idservico // Pegando o ID do serviço

Solicitacoes.findOne({ where: { id: IDServico } }).then(minhassolicitacoes => { // Buscando a solicitação pelo ID para realizar o pagamento
    Financeiro.findOne({ where: { IDSolicitacao: IDServico } }).then(financeiro => { // Buscando o financeiro pelo ID da solicitação

        res.render('CheckoutPage.ejs', { minhassolicitacoes: minhassolicitacoes, financeiro: financeiro });  // Renderizando o Pagamento
    })
})

    })

app.post('/cadastrocuidadoso', (req, res) => {

    //DADOS DO FORMULARIO
    let imagemBuffer = require('./public/js/imgpadrao') // Pegando a imagem padrao
    let nomeCuidadoso = req.body.nome // Nome do Cuidadoso
    let email = req.body.email // Email do Cuidadoso
    let senha = req.body.senha // Senha do Cuidadoso
    let cpf = req.body.cpf // CPF do Cuidadoso
    let diaria = req.body.Diaria // Diaria do Cuidadoso
    let confirmacaosenha = req.body.confirmacaosenha // Confirmação da Senha do Cuidadoso
    let formacao = req.body.formacao // Formação do Cuidadoso
    let datanascimento = req.body.datanascimento // Data de Nascimento do Cuidadoso
    let genero = req.body.genero // Gênero do Cuidadoso
    let celular = req.body.celular // Celular do Cuidadoso
    let descricao = `Olá, eu sou ${nomeCuidadoso}, e estou à sua inteira disposição para oferecer cuidados excepcionais` // Descrição Padrão do Cuidadoso
    let imagemantecedentes = req.body.imagemantecedentes // Imagem de Antecedentes do Cuidadoso
    let estado = req.body.estado // Estado
    let cidade = req.body.cidade // Cidade
    let bairro = req.body.bairro // Bairro
    let rua = req.body.rua // Rua
    let numero = req.body.numero // Número  
    let complemento = req.body.complemento // Complemento
    let referencia = req.body.referencia // Referência

//CONFIGURAÇÃO DA CRIPTOGRAFIA
    const salt = bcrypt.genSaltSync(10) // Gerando o Salt para a CRIPTOGRAFIA
    let hash = bcrypt.hashSync(senha, salt) // Criando uma mistura da SENHA e o Salt
    let tokenhash = bcrypt.hashSync(email, salt) // Criando o primeiro Token do Cuidadoso


    Cadastros.findAll({ where: { Email: email }, raw: true }).then(existencia => { // Verificando se o Cuidadoso existe

        if (existencia == null) { // Verificando se o Cuidadoso existe
            res.redirect('/')
        }
        else { // Se o Cuidadoso existir
            if (senha == confirmacaosenha) {

                if (estado == undefined) { // Verificando se o estado foi selecionado ( Porque no formulario de cadastro de cliente não possui o campo de estado)
                    
                    Cadastros.create({ //Cadastro como cliente
                        Nome: nomeCuidadoso, CPF: cpf, Email: email, TipoConta: 'Cliente', Senha: hash, Token: tokenhash, DataNacimento: datanascimento, Genero: genero,
                        Celular: celular, FotoPerfil: imagemBuffer
                    })

                    res.redirect('/') // Redirecionando para a Home

                }
                else {  // Se o estado foi selecionado e porque o tipo de cadastro e de Cuidadoso
                    Cadastros.create({ // Cadastro como Cuidadoso
                        Nome: nomeCuidadoso, CPF: cpf, Email: email, TipoConta: 'CuidadosoAspirante', Senha: hash, Token: tokenhash, Formacao: formacao, DataNacimento: datanascimento, Genero: genero,
                        Celular: celular, Diaria: diaria, FotoPerfil: imagemBuffer, BonsAntecedentes: imagemantecedentes, Estado: estado, Cidade: cidade, Bairro: bairro, Rua: rua,
                        Numero: numero, Complemento: complemento, Referencia: referencia, descricao: descricao
                    })

                    res.redirect('/')

                }
            }
        }
    })
})

app.get('/perfil/:id', (req, res) => {

    const dataAtual = new Date(); // Modulo de Data
    const numeroDoMesAtual = dataAtual.getMonth() + 1; // Mes Atual

    let TipoContaLogado = req.session.TipoConta // Pegando o Tipo de Conta logado
  
    let IDPerfil = req.params.id // Pegando o ID do Perfil
    
    Cadastros.findOne({ where: { id: IDPerfil } }).then(cadastro => { // Verificando se o Perfil existe

        if (cadastro) { // Se o Perfil existir

            

                Posts.findAll({ order: [['id', 'DESC']], raw: true, where: { IDCadastro: IDPerfil } }).then(posts => { // Verificando se o Perfil tem Posts

                    if (TipoContaLogado == 'Administrador') { // Se o Perfil for Administrador

                        Cadastros.findAll({ where: { TipoConta: 'CuidadosoAspirante' } }).then(aspirantes => { // Buscando todos os Aspirantes a Cuidadoso
                         
                            res.render('ProfilePage.ejs', { cadastro: cadastro, posts: posts, agenda: mesesDoAno[numeroDoMesAtual], aspirantes: aspirantes })

                        })

                    }
                    else { // Se o Perfil Não for Administrador

                        Solicitacoes.findAll({ raw: true, where: { IDCuidadoso: IDPerfil, StatusPedido: 'Solicitação Aceita' } }).then(solicitacoes => { // Buscando Solicitações Aceitas

                        res.render('ProfilePage.ejs', { cadastro: cadastro, solicitacoes: solicitacoes, posts: posts, agenda: mesesDoAno[numeroDoMesAtual] }) // Renderizando
                        
                    })
                    }
                })
            

        } else { // Se o Perfil não existir

            res.redirect('/contrate') // Redirecionando para a Home

        }
    })
})

app.get('/Servico/:id', testartoken, (req, res) => {

    let IDLogado = req.session.userId // ID de quem está logado
    let IDServico = req.params.id // ID do Servico
    
Solicitacoes.findOne({ where: { id: IDServico } }).then(servico => { // Verificando se o Servico existe

    Cadastros.findOne({ where: { id: servico.IDCuidadoso } }).then(cuidadoso => { //Buscando o Cuidadoso pelo ID

        Cadastros.findOne({ where: { id: IDLogado } }).then(contratante => { // Buscando o Contratante pelo ID
            
        Financeiro.findOne({ where: { IDCuidadoso: IDLogado, Status: 'Pendente' } }).then(financeiro => { // Buscando o Financeiro pelo ID
            
    res.render('ServiceDetailsPage.ejs', { servico: servico, cuidadoso: cuidadoso, logado: IDLogado, contratante: contratante, financeiro: financeiro }) // Renderizando
    
})
})
})
})
 })

app.get('/contrate', (req, res) => {

    let filtro = req.query.estado // Filtro por estado
    let cidade = req.query.cidade // Filtro por Cidade

    
        if (filtro) { // Verificando se o filtro  de estado existe
            if (cidade) { // Verificando se o filtro de cidade existe

                Cadastros.findAll({ where: { TipoConta: 'Cuidadoso', Estado: filtro, Cidade: cidade } }).then(cadastro => { //Buscando os Cuidadosos pelo estado e Cidade
                    res.render('CuidadososListingPage.ejs', {  cadastro: cadastro }) // Renderizando
                })

            } 
            else // Se o filtro de Cidade não existir
            {

                Cadastros.findAll({ where: { TipoConta: 'Cuidadoso', Estado: filtro } }).then(cadastro => { //Buscando os Cuidadosos pelo estado
                    res.render('CuidadososListingPage.ejs', {  cadastro: cadastro }) // Renderizando
                })

            }
        }
         else // Se não existir o filtro
          {
            Cadastros.findAll({ where: { TipoConta: 'Cuidadoso' } }).then(cadastro => { //Buscando todos os Cuidadosos
                module.exports = cadastro; // Exportando
                res.render('CuidadososListingPage.ejs', {  cadastro: cadastro }) // Renderizando
            })
        }
    })

app.post('/aceitarsolicitacao', testartoken, async (req, res) => {
 
    let idsolicitacao = req.body.idsolicitacao // ID da Solicitacao
    let idcuidadoso = req.body.idcuidadoso // ID do Cuidadoso
    let dataAtual = new Date();    // Obtendo o dia, mês e ano
    let dia = dataAtual.getDate().toString().padStart(2, '0');    // Pegando o dia
    let mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0'); // Pegando o mês
    let ano = dataAtual.getFullYear().toString(); // Pegando o ano
    let dataFormatada = `${dia}/${mes}/${ano}`; // Formatando a data

    Solicitacoes.findOne({ where: { id: idsolicitacao } }).then(solicitacao => {  // Buscando a solicitação pelo ID
        
        let ValorTaxa = solicitacao.Valor * 0.1 // Calculando o valor da Taxa
 
        Financeiro.create({ IDCuidadoso: idcuidadoso, IDSolicitacao: idsolicitacao , NomeCuidadoso: solicitacao.NomeCuidadoso, DataAceitacao: dataFormatada, ValoraPagar: ValorTaxa, ValorTotal: solicitacao.Valor, Status: 'Pendente' }) //

        Solicitacoes.update({ StatusPedido: 'Solicitação Aceita' }, { where: { id: idsolicitacao } }) // Atualizando o status da solicitação

        res.redirect('/servico/' + idsolicitacao) // Redirecionando para o perfil do Cuidadoso
    })

})

app.post('/negarsolicitacao', testartoken, async (req, res) => {

let IDSolicitacao = req.body.idsolicitacao // ID da Solicitacao

    Solicitacoes.update({ StatusPedido: 'Solicitação Negada' }, { where: { id: IDSolicitacao } }) // Atualizando o status da solicitação

    res.redirect('/servico/' + IDSolicitacao) // Redirecionando para o perfil do Cuidadoso

})

app.post('/UploadFTPerfil', upload.single('imagem'), async (req, res) => {

    let IDPerfil = req.body.id // ID do Perfil
    const imagem = req.file.buffer; // Dados binários da imagem
    const certo = imagem.toString('base64')// Codificando a imagem

    Cadastros.update({ FotoPerfil: certo }, { where: { id: IDPerfil } }) // Atualizando a imagem no BD
    res.redirect('/contrate') // Redirecionando para o perfil
})

app.post('/Solicitar', async (req, res) => {
    
    let dataAtual = new Date(); // Modulo para pegar a data

// Obtendo o dia, mês e ano
let dia = dataAtual.getDate();
let mes = dataAtual.getMonth() + 1; 
let ano = dataAtual.getFullYear();
var NomeMes = mesesDoAno[mes].nome; //Pegando o nome do mes

// Formatando para o formato desejado (DD/MM/AAAA)
let dataFormatada = `${dia}/${mes}/${ano}`;

// Importando dados das inputs
    let Horadeinicio = req.body.HoraInicio
    let enderecoSelecionado = req.body.endsa
    let IdContratante = req.session.userId
    let idcuidadoso = req.body.CuidadosoID 
    let DiaAtendimento = req.body.dia 
    let Deficiencia = req.body.Deficiencia 
    let Mensagem = req.body.Mensagem
    let Status = "Solicitação Pendente"  
    let horaformatada = Horadeinicio
    if (Deficiencia.length == 0) { // Se deficiencia estiver vazia 
        Deficiencia = "Não possui deficiência"
    }
    Enderecos.findOne({ where: { id: enderecoSelecionado } }).then(endereco => { // Buscando o Endereço selecionado
        
    Cadastros.findOne({ where: { id: idcuidadoso } }).then(cadastro => { // Buscando o Cuidadoso selecionado

        let Valor = cadastro.Diaria // Pegando o valor da diaria do Cuidadoso
        let NomeCuidadoso = cadastro.Nome // Nome do Cuidadoso

        Cadastros.findOne({ where: { id: IdContratante } }).then(contratante => {// Buscando o Dados do Contratante
            
        Solicitacoes.create({ //Criando a Solicitação no BD

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
            Bairro:endereco.Bairro,
            Rua: endereco.Rua, 
            Numero: endereco.Numero,
            Complemento: endereco.Complemento,
            Referencia: endereco.Referencia

        }).then(() => {
        })
    })
    })
})
    res.redirect('/Historico') // Redirecionando para o Historico
})

app.post('/uploadpost', upload.single('imagem'), async (req, res) => {
    //Modulos de Data
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Note que janeiro é 0
    const ano = data.getFullYear();

    // Formatando para o formato desejado (DD/MM/AAAA)
    let data1 = `${dia}/${mes}/${ano}`;

    let id = req.body.id
    let assunto = req.body.assunto

    const { nome, descricao } = req.body;
    const imagem = req.file.buffer; // Dados binários da imagem


    let idcerto = id[0]
    
    Cadastros.findOne({ where: { id: idcerto } }).then(cadastro => {




        const certo = imagem.toString('base64')




        Posts.create({ IDCadastro: idcerto, NomeCadastro: cadastro.Nome, Data: data1, Assunto: assunto, Foto: certo })

        res.redirect('/Perfil/' + idcerto)
    })
})

app.post('/updatepost', (req, res) => {

    let idpost = req.body.idpost // Recebendo o ID do Post
    let novoassunto = req.body.novoassunto // Recebendo o novo Assunto
    let idperfil = req.body.idperfil   // Recebendo o ID do Perfil

    Posts.update({ Assunto: novoassunto }, { where: { id: idpost } }) // Atualizando o Post

    res.redirect(`/Perfil/${idperfil}`) // Redirecionando para o Perfil

})

app.post('/AprovarCuidador', (req, res) => {

    let IDCuidadoso = req.body.idcuidadoso // Recebendo o ID do Cuidadoso
    let IDLogado = req.session.userId // Recebendo o ID do Logado

    Cadastros.findOne({ where: { id: IDLogado } }).then(adm => { // Verificando qual tipo de conta está logado

        if (adm.TipoConta == 'Administrador') { // Se for Administrador

            Cadastros.update({ TipoConta: 'Cuidadoso' }, { where: { id: IDCuidadoso } }) // Atualizando o Cuidadoso

            res.redirect('/perfil/' + IDLogado) // Redirecionando para o Perfil

        } else {
            res.redirect('/perfil/' + IDCuidadoso) // Redirecionando para o Perfil
        }
    })
})

app.post('/updatedescri', (req, res) => {

    let IDPerfil = req.body.idperfil
    let NovaDescri = req.body.novadescri
    
    Cadastros.update({ descricao: NovaDescri }, { where: { id: IDPerfil } })

    res.redirect(`/Perfil/${IDPerfil}`)

})

app.get('/logout', (req, res) => {

    req.session.isLoggedIn = false; // Verificando se o Usuário Esta Logado
    req.session.token = '' // Esvazinando o Token
    req.session.destroy(); // Destruindo a Sessão
    
    res.redirect('/') // Redirecionando para o Home
     
});

app.post('/pago', testartoken, async (req, res) => {
 
    let IDSolicitacao = req.body.idsolicitacao // Recebendo o ID da Solicitacao

        Financeiro.update({ Status: 'Pago' }, { where: { IDSolicitacao: IDSolicitacao } }) // Atualizando o Financeiro
       
        res.redirect('/servico/' + IDSolicitacao) // Redirecionando para o Servico
    
  
})

//Aqui eu estou declarando a porta em que esta rodando meu servidor

app.listen(80, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro ao iniciar o Servidor!")
    } else {
        console.log("Servidor iniciado com sucesso")
    }
})


