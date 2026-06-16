const express = require("express");
const Database = require("better-sqlite3");
const db = new Database("database.db");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());



// CREATE TABLE
db.run(`
  CREATE TABLE IF NOT EXISTS validations (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     role TEXT,
     nom TEXT,
     
     date TEXT,
     checklist TEXT )
     
    `);


// SAVE DATA
app.post("/valider", (req, res) => {

    console.log("Données reçues :", req.body);

    const { role, nom, checklist } = req.body;

    // ===== INFIRMIER =====
if (role === "infirmier") {
const data = checklist;

if (
    !data.patient ||
    !data.dateNaissance ||
    !data.siteOperatoire ||
    !data.chirurgien ||
    !data.anesthesiste ||
    !data.allergies ||
    !data.maladies ||
    !data.traitement
) {
    return res.status(400).json({
        message: "Tous les champs doivent être remplis"
    });
}


    
console.log("DATA=",data);
console.log("patient =", data.patient);
console.log("dateNaissance =", data.dateNaissance);
console.log("siteOperatoire =", data.siteOperatoire);
console.log("chirurgien =", data.chirurgien);
console.log("anesthesiste =", data.anesthesiste);
console.log("allergies =", data.allergies);
console.log("maladies =", data.maladies);
console.log("traitement =", data.traitement);
}
    
   
     

    // ===== CHIRURGIEN / ANESTHESISTE =====
    else {
        const toutesCochees=checklist.every(el=>el.checked===true);

        if (!checklist || checklist.length === 0 ||!toutesCochees) {
            return res.status(400).json({
                message: "Toutes les cases doivent etre cochées"
            });
        }
    }

    const date = new Date().toLocaleString();

    db.run(`
        INSERT INTO validations (role, nom, date, checklist)
         VALUES (?, ?, ?, ?)`,
        [role, nom, date, JSON.stringify(checklist)],

        function (err) {

            if (err) {
                console.error("Erreur DB :", err);

                return res.status(500).json({
                    message: "Erreur serveur DB"
                });
            }

            res.json({
                message: "Validation enregistrée",
                id: this.lastID
            });
        }
    );
});

// START SERVER

app.get("/historique", (req, res) => {

    const sql =`
        SELECT id, role, nom,  date, checklist
        FROM validations
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erreur historique :", err);
            return res.status(500).json({ message: "Erreur serveur" });
        }

        res.json(rows);
    });
});
app.listen(3000, "0.0.0.0",() => {
    console.log("Serveur OK");
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});