const Home = require('../Routes/Home')
const Login = require('../Routes/Login')
const AuthLogin = require('../Routes/AuthLogin')
const ProfessionalRegister = require('../Routes/ProfessionalRegistration')
const Logout = require('../Routes/Logout')
const ProfessionalListing = require('../Routes/CuidadosoListing');
const ProfilePage = require('../Routes/ProfilePage');
const HiringProfessional = require('../Routes/HiringProfessional');
const SendMensage = require('../Routes/SendMensage');
const PaidRequest = require('../Routes/PaidRequest');
const ServiceDetail= require('../Routes/ServiceDetail');
const ServicePayment = require('../Routes/ServicePayment');
const AcceptRequest = require('../Routes/AcceptRequest')
const ServiceSolicition = require('../Routes/ServiceSolicition')
const MyServices = require('../Routes/MyServices')
const HistoricServices = require('../Routes/HistoricServices')
const DeletePublication = require('../Routes/DeletePublication')
const DenyRequest = require('../Routes/DenyRequest')
const UploadPhotoProfile = require('../Routes/UploadPhotoProfile')
const NewPost = require('../Routes/NewPost')
const UpdatePost = require('../Routes/UpdatePost')
const UpdateDescription = require('../Routes/UpdateDescription')
const SaveNewAddress = require('../Routes/SaveNewAddress')
const ApproveProfessional = require('../Routes/ApproveProfessional')
const NewValueDaily = require('../Routes/NewValueDaily')
const UndefinedRouteA = require('../Routes/UndefinedRouteA')
const UndefinedRouteB = require('../Routes/UndefinedRouteB')

const NodeRoutes = {
    Home,
    Login,
    AuthLogin,
    ProfessionalRegister,
    Logout,
    ProfessionalListing,
    ProfilePage,
    HiringProfessional,
    SendMensage,
    PaidRequest,
    ServiceDetail,
    ServicePayment,
    AcceptRequest, 
    ServiceSolicition,
    MyServices,
    HistoricServices,
    DeletePublication,
    DenyRequest,
    UploadPhotoProfile,
    NewPost, 
    UpdatePost,
    UpdateDescription,
    SaveNewAddress, 
    ApproveProfessional,
    NewValueDaily,
    UndefinedRouteA,
    UndefinedRouteB
};

module.exports = NodeRoutes;



