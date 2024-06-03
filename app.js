// Importação dos módulos necessários
const express = require('express'); // Framework web
const bodyParser = require('body-parser'); // Middleware para parsing do corpo das requisições
const multer = require('multer'); // Middleware para upload de arquivos
const session = require("express-session"); // Middleware para gerenciamento de sessões
const { Op, where } = require('sequelize'); // Operadores do Sequelize
const { raw } = require('mysql2'); // Função raw do MySQL2

// Iniciando o Express
const app = express(); 

// Configurando o Body Parser para lidar com dados codificados no formato URL
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando o mecanismo de visualização para EJS
app.set('view engine', 'ejs');

// Importação de arquivos de banco de dados
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


// Importação das rotas
const NodeRoutes = require('./ServerModules/Dependences/RoutesDependences');

//Importação das Funções
const CheckToken = require('./ServerModules/Functions/CheckToken');
const CuidadosoValidade = require('./ServerModules/Functions/CuidadosoValidate');
const AdmValidade = require('./ServerModules/Functions/AdmValidate');


// Configuração das rotas
app.get('/', NodeRoutes.Home);
app.get('/Login', NodeRoutes.Login);
app.post('/LoginValidate', NodeRoutes.AuthLogin);
app.get('/Logout', NodeRoutes.Logout);
app.get('/ProfilePage/:id', NodeRoutes.ProfilePage);
app.post('/CuidadosoRegister', NodeRoutes.ProfessionalRegister);
app.get('/CuidadosoListing', NodeRoutes.ProfessionalListing);
app.get('/HireProfessional', CheckToken, NodeRoutes.HiringProfessional);
app.post('/PaymentMade', CheckToken, NodeRoutes.PaidRequest);
app.get('/Service/:id', CheckToken, NodeRoutes.ServiceDetail);
app.get('/Pay/:idservico', CheckToken, NodeRoutes.ServicePayment);
app.post('/RequestService', CheckToken, NodeRoutes.ServiceSolicition);
app.get('/Historico', CheckToken, NodeRoutes.HistoricServices);
app.post('/AcceptRequest', CheckToken, CuidadosoValidade,  NodeRoutes.AcceptRequest);
app.post('/SendMessage', CheckToken, NodeRoutes.SendMensage);
app.get('/MyServices', CheckToken, CuidadosoValidade, NodeRoutes.MyServices);
app.post('/DeletePost', CheckToken, CuidadosoValidade, NodeRoutes.DeletePublication);
app.post('/DenyRequest', CheckToken, CuidadosoValidade, NodeRoutes.DenyRequest);
app.post('/ChangeProfilePhoto', CheckToken, CuidadosoValidade, NodeRoutes.UploadPhotoProfile);
app.post('/UploadPost', CheckToken, CuidadosoValidade, NodeRoutes.NewPost);
app.post('/UpdatePost', CheckToken, CuidadosoValidade, NodeRoutes.UpdatePost);
app.post('/UpdateDescription', CheckToken, CuidadosoValidade, NodeRoutes.UpdateDescription);
app.post('/SaveAddress', CheckToken, NodeRoutes.SaveNewAddress);
app.post('/UpdateDaily', CheckToken, CuidadosoValidade, NodeRoutes.NewValueDaily);
app.get('/UndefinedRouteA', NodeRoutes.UndefinedRouteA);
app.get('/UndefinedRouteB', NodeRoutes.UndefinedRouteB);
app.post('/ApproveProfessional', CheckToken, AdmValidade, NodeRoutes.ApproveProfessional);


app.listen(80)