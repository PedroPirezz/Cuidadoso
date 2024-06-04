const express = require('express'); 
const bodyParser = require('body-parser'); 
const SessionConfig = require('./ServerModules/Session/SessionConfig');
const LocalVariables = require('./ServerModules/Session/LocalVariables');
const Routes = require('./ServerModules/Routes/RevealingRoutes/RevealingRoutes'); 
const app = express(); 

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(SessionConfig);
app.use(LocalVariables);
app.use('/', Routes);

app.listen(80)