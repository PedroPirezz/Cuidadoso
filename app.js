// Importação dos módulos necessários
const express = require('express'); // Framework web
const bodyParser = require('body-parser'); // Middleware para parsing do corpo das requisições
const axios = require('axios'); // Biblioteca para requisições HTTP
const multer = require('multer'); // Middleware para upload de arquivos
const session = require("express-session"); // Middleware para gerenciamento de sessões
const { Op, where } = require('sequelize'); // Operadores do Sequelize
const { raw } = require('mysql2'); // Função raw do MySQL2

// Iniciando o Express
const app = express(); 
exports.app = app;

// Configurando o Body Parser para lidar com dados codificados no formato URL
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando o mecanismo de visualização para EJS
app.set('view engine', 'ejs');

// Importação de arquivos de banco de dados
const DB = require('./ServerModules/DatabaseModels/DatabaseModels');
const connection = require('./Database/database');

// Configurando o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configuração do armazenamento do Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.upload = upload;

// Configuração da sessão
app.use(session({
    secret: 'Cuidadoso', // Chave secreta para assinar os cookies de sessão
    resave: false, // Salva a sessão apenas se modificada
    saveUninitialized: true, // Salva a sessão mesmo que não inicializada
    cookie: {
        expires: false // Cookie expira quando o navegador é fechado
    }
}));

// Conectando ao banco de dados
connection.authenticate()
    .then(() => {
        console.log("Database connected with SUCCESS!");
    })
    .catch((msgErr) => {
        console.log("Database connection ERROR:", msgErr);
    });

// Middleware para configuração de variáveis locais
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userName = req.session.userName || null;
    res.locals.userId = req.session.userId || null;
    res.locals.token = req.session.token || null;
    res.locals.TipoConta = req.session.TipoConta;
    next();
});

// Função para testar o token de sessão
async function testartoken(req, res, next) {
    if (req.session.userId) {
        let usuario = req.session.userId;
        let token = req.session.token;

        let user = await DB.Cadastros.findOne({ where: { id: usuario } });

        if (user && user.Token == token) {
            next();
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
}
exports.testartoken = testartoken;

// Importação das rotas
const NodeRoutes = require('./ServerModules/Dependences/RoutesDependences');

// Configuração das rotas
app.get('/login', NodeRoutes.Login);
app.get('/logout', NodeRoutes.Logout);
app.get('/', NodeRoutes.Home);
app.get('/perfil/:id', NodeRoutes.ProfilePage);
app.post('/validarlogin', NodeRoutes.AuthLogin);
app.post('/cadastrocuidadoso', NodeRoutes.ProfessionalRegister);
app.get('/contrate', NodeRoutes.ProfessionalListing);
app.get('/contratar', testartoken, NodeRoutes.HiringProfessional);
app.post('/EnviarMensagem', testartoken, NodeRoutes.SendMensage);
app.post('/pago', testartoken, NodeRoutes.PaidRequest);
app.get('/servico/:id', testartoken, NodeRoutes.ServiceDetail);
app.get('/Pagamento/:idservico', testartoken, NodeRoutes.ServicePayment);
app.post('/aceitarsolicitacao', testartoken, NodeRoutes.AcceptRequest);
app.post('/solicitar', testartoken, NodeRoutes.ServiceSolicition);
app.get('/MeusServicos', testartoken, NodeRoutes.MyServices);
app.get('/Historico', testartoken, NodeRoutes.HistoricServices);
app.post('/deletarpubli', testartoken, NodeRoutes.DeletePublication);
app.post('/negarsolicitacao', testartoken, NodeRoutes.DenyRequest);
app.post('/UploadFTPerfil', testartoken, NodeRoutes.UploadPhotoProfile);
app.post('/uploadpost', testartoken, NodeRoutes.NewPost);
app.post('/updatepost', testartoken, NodeRoutes.UpdatePost);
app.post('/updatedescri', testartoken, NodeRoutes.UpdateDescription);
app.post('/salvarendereco', testartoken, NodeRoutes.SaveNewAddress);
app.post('/AprovarCuidador', testartoken, NodeRoutes.ApproveProfessional);
app.post('/NovaDiaria', testartoken, NodeRoutes.NewValueDaily);
app.get('/CadastroValor', NodeRoutes.UndefinedRouteA);
app.get('/CadastroValor1', NodeRoutes.UndefinedRouteA);

// Iniciando o servidor na porta 80
app.listen(80, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro ao iniciar o Servidor!");
    } else {
        console.log("Servidor iniciado com sucesso");
    }
});
