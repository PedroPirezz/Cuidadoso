const express = require('express'); 
const bodyParser = require('body-parser'); 
const SessionConfig = require('./ServerModules/Session/SessionConfig');
const LocalVariables = require('./ServerModules/Session/LocalVariables');
const Routes = require('./ServerModules/Routes/RevealingRoutes/RevealingRoutes'); 
const path = require('path');

const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views')); // Caminho correto da pasta views
app.use(SessionConfig);
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(LocalVariables);
app.use('/', Routes);


app.listen(80)