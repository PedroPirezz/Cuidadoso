const DB = require('../DatabaseModels/DatabaseModels');

function ServiceValue(IDCuidadoso)
 {
  console.log("Inciando a Função ServiceValue(IDCUIDADOSO)"); 
DB.Cadastros.findOne({ where: { id: IDCuidadoso } }).then(Profissional => {

  let ValorDaDiaria = Profissional.Diaria;
  let ValorDaTaxa = (ValorDaDiaria*0.1);

  return ValorDaTaxa
});
 }
 module.exports = ServiceValue
