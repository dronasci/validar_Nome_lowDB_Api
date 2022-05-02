const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");

const db = lowDb(new FileSync('bd/db.json'));

db.defaults({ nomes: [] }).write();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 4000;

app.get('/verificar/:nome', (req, res) => {
  let nomeCorrigido = req.params.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  nomeCorrigido = nomeCorrigido.toLowerCase();

  try {
    const data = db
      .get("nomes")
      .find({ nome: nomeCorrigido })
      .value();

    if (!data) return res.status(404).json({ success: false} );;


    return res.status(200).json({ success: true });

  } catch (error) {


  }


})

app.post('/nome/novo', (req, res) => {
  try {

    if (Object.keys(req.body).length === 0) {
      error_msg = {"message":"Verifique o corpo do json"};
      return res.status(404).json(error_msg);
    } else {
      const data = db
      .get("nomes")
      .value();

      const name = req.body
      db.get("nomes").push({
        id: data.length + 1, ...name
      }).write();
      return res.status(200).json({ success: true });
      
    }

  } catch (error) {

  }
})

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`)
})