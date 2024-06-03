const express = require('express'); // Framework web
const router = express.Router();

// Importação das rotas
const NodeRoutes = require('../../Dependences/RoutesDependences');

//Importação das Funções
const CheckToken = require('../../Functions/CheckToken');
const CuidadosoValidade = require('../../Functions/CuidadosoValidate');
const AdmValidade = require('../../Functions/AdmValidate');

// Configuração das rotas
router.get('/', NodeRoutes.Home);
router.get('/Login', NodeRoutes.Login);
router.post('/LoginValidate', NodeRoutes.AuthLogin);
router.get('/Logout', NodeRoutes.Logout);
router.get('/ProfilePage/:id', NodeRoutes.ProfilePage);
router.post('/CuidadosoRegister', NodeRoutes.ProfessionalRegister);
router.get('/CuidadosoListing', NodeRoutes.ProfessionalListing);
router.get('/HireProfessional', CheckToken, NodeRoutes.HiringProfessional);
router.post('/PaymentMade', CheckToken, NodeRoutes.PaidRequest);
router.get('/Service/:id', CheckToken, NodeRoutes.ServiceDetail);
router.get('/Pay/:idservico', CheckToken, NodeRoutes.ServicePayment);
router.post('/RequestService', CheckToken, NodeRoutes.ServiceSolicition);
router.get('/Historico', CheckToken, NodeRoutes.HistoricServices);
router.post('/AcceptRequest', CheckToken, CuidadosoValidade,  NodeRoutes.AcceptRequest);
router.post('/SendMessage', CheckToken, NodeRoutes.SendMensage);
router.get('/MyServices', CheckToken, CuidadosoValidade, NodeRoutes.MyServices);
router.post('/DeletePost', CheckToken, CuidadosoValidade, NodeRoutes.DeletePublication);
router.post('/DenyRequest', CheckToken, CuidadosoValidade, NodeRoutes.DenyRequest);
router.post('/ChangeProfilePhoto', CheckToken, CuidadosoValidade, NodeRoutes.UploadPhotoProfile);
router.post('/UploadPost', CheckToken, CuidadosoValidade, NodeRoutes.NewPost);
router.post('/UpdatePost', CheckToken, CuidadosoValidade, NodeRoutes.UpdatePost);
router.post('/UpdateDescription', CheckToken, CuidadosoValidade, NodeRoutes.UpdateDescription);
router.post('/SaveAddress', CheckToken, NodeRoutes.SaveNewAddress);
router.post('/UpdateDaily', CheckToken, CuidadosoValidade, NodeRoutes.NewValueDaily);
router.get('/UndefinedRouteA', NodeRoutes.UndefinedRouteA);
router.get('/UndefinedRouteB', NodeRoutes.UndefinedRouteB);
router.post('/ApproveProfessional', CheckToken, AdmValidade, NodeRoutes.ApproveProfessional);

module.exports = router