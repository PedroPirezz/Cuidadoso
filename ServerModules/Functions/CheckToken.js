const DB = require('../DatabaseModels/DatabaseModels');

async function CheckToken(req, res, next) {
  if (req.session.userId) {
      let usuario = req.session.userId;
      let token = req.session.token;

      let user = await DB.Cadastros.findOne({ where: { id: usuario } });

      if (user && user.Token == token) {
        console.log("DEU BAO AQUI NO MEU")
          next();
      } else {
          res.redirect("/login");
      } 
  } else {
      res.redirect("/login");
  }
}

module.exports = CheckToken

