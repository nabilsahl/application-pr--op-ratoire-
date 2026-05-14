// ================= VARIABLES GLOBALES =================

let checklistData = [];
let roleChoisi = "";
let currentuser="";

 
function setRole(role) {
    roleChoisi = role;
    console.log("Role=",roleChoisi);
 
    // Effet visuel (optionnel mais utile)
    document.querySelectorAll("button").forEach(btn => {
        btn.style.backgroundColor = "";
    });

    event.target.style.backgroundColor = "green";
} 
// ================= LOGIN =================

function login() {
    let username = document.getElementById("username").value;
    currentuser=username;
    let password = document.getElementById("password").value;
    roleChoisi= document.getElementById("role").value;
    console.log("User :", username);
    console.log("Password :", password);
    console.log("Role =",roleChoisi);

    if (password === "1234") {
        alert("Connexion réussie - " + roleChoisi); afficherChecklist(roleChoisi);
    } else {
        alert("Mot de passe incorrect");
    }
}
    
    

   
    
   

    // afficher checklist
   

    afficherChecklist(roleChoisi);


// ================= AFFICHER CHECKLIST ================= 
function afficherChecklist(role) {
    const titre = document.getElementById("titre");
    const liste = document.getElementById("liste");
    const formInf = document.getElementById("form-infirmier");

    // reset
    liste.innerHTML = "";
    formInf.classList.add("hidden");

    // ===== INFIRMIER =====
    if (role === "infirmier") {
        titre.innerText = "🧾 Checklist Infirmier";
        formInf.classList.remove("hidden");
        checklistData = [];
    }

    // ===== ANESTHÉSISTE =====
    if (role === "anesthesiste") {
        titre.innerText = "💉 Checklist Anesthésiste";

        checklistData = [
            "Appareil d’anesthésie testé",
            "Test du circuit",
            "Pression O2",
            "Pression CO2",
            "pression N2O",
            "pression air medical ok",
            "pression vide ok",
            "Ventilateur fonctionnel",
            "Moniteur fonctionnel",
            "Défibrillateur testé",
            "Aspirateur fonctionnel"
        ];
    }

    // ===== CHIRURGIEN =====
    if (role === "chirurgien") {
        titre.innerText =  "Checklist Chirurgien";

        checklistData = [
            "Bistouri électrique testé",
            "Plaque neutre positionnée",
            "Instruments stériles",
            "Table opératoire OK",
            "Éclairage OK"
        ];
    }

    // afficher checkbox
    checklistData.forEach((item, i) => {
        liste.innerHTML +=`
            <div class="check-item">
                <input type="checkbox" id="c${i}">
                <span>${item}</span>
               
            </div>`
        ;
    });
}

// ================= VALIDATION =================
function valider() {


    let nomInput = document.getElementById("patient");
    let nom="";
    if (nomInput){nom=nomInput.value;}
    
    console.log("nom=",nom);
   

    console.log("ROLE=",roleChoisi);

    let checklist = [];

    // 🔹 INFIRMIER (inputs texte)
    
    if (roleChoisi === "infirmier") {
    let nom= document.getElementById("patient").value;
    let dateNaissance = document.getElementById("dateNaissance").value;

    let siteOperatoire = document.getElementById("siteOperatoire").value;

    let chirurgien = document.getElementById("chirurgien").value;

    let anesthesiste = document.getElementById("anesthesiste").value;

    let allergies = document.getElementById("allergies").value;

    let maladies = document.getElementById("maladies").value;

    let traitement = document.getElementById("traitement").value;
console.log("nom =", nom);
console.log("dateNaissance =", dateNaissance);
console.log("siteOperatoire =", siteOperatoire);
console.log("chirurgien =", chirurgien);
console.log("anesthesiste =", anesthesiste);
console.log("allergies =", allergies);
console.log("maladies =", maladies);
console.log("traitement =", traitement);

    checklist.push({

        patient:nom,

        dateNaissance: dateNaissance,

        siteOperatoire: siteOperatoire,

        chirurgien: chirurgien,

        anesthesiste: anesthesiste,

        allergies: allergies,

        maladies: maladies,

        traitement: traitement
    });

 

    
}

    // 🔹 CHIRURGIEN (checkbox)
    if (roleChoisi === "chirurgien") {
        document.querySelectorAll("input[type=checkbox]").forEach(cb => {
            checklist.push({
                item: cb.name,
                checked: cb.checked
            });
        });
    }

    // 🔹 ANESTHÉSISTE (checkbox)
    if (roleChoisi === "anesthesiste") {
        document.querySelectorAll("input[type=checkbox]").forEach(cb => {
            checklist.push({
                item: cb.name,
                checked: cb.checked
            });
        });
       
    }
   // ===== VERIFICATION =====

if (roleChoisi === "infirmier") {

    let champs = document.querySelectorAll(".input-checklist");

    let tousRemplis = true;

    champs.forEach(champ => {

        if (champ.value.trim() === "") {
            tousRemplis = false;
        }
    });

    if (!tousRemplis) {

        alert("❌ Tous les champs doivent être remplis");
        return;
    }

} else {

    let cases = document.querySelectorAll('input[type="checkbox"]');

    let toutesCochees = true;

    cases.forEach(cb => {

        if (!cb.checked) {
            toutesCochees = false;
        }
    });

    if (!toutesCochees) {

        alert("❌ Toutes les cases doivent être cochées");
        return;
    }
}
console.log("CHECKLIST=",checklist);
    fetch("/valider", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            role: roleChoisi,
            nom: currentuser,
            checklist: checklist,
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("✅ " + data.message);

        // 🔥 RETOUR AUTOMATIQUE À L’ACCUEIL
        retourAccueil();
    })
    .catch(error => {
        console.error(error);
        alert("❌ erreur serveur");
    });
}
function retourAccueil() {
    document.getElementById("app").innerHTML =`
        <h2>App préopératoire</h2>
        <input id="roleChoisi" placeholder="Role (infirmier/chirurgien/anesthesiste)">
        <input id="password" type="password" placeholder="Mot de passe">
        <button onclick="login()">Connexion</button>
    `;
}


function voirHistorique() {
    

    fetch("/historique")
    .then(res => res.json())

    .then(data => {

        let html = `
        <div style="padding:20px;">

            <h2>📋 Historique des validations</h2>

            <table border="1" style="
                width:100%;
                border-collapse:collapse;
                background:white;
            ">

                <tr style="
                    background:#007BFF;
                    color:white;
                ">
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Date</th>
                    <th>Détails</th>
                </tr>
        `;

        data.forEach(item => {

            let checklist = "";
            if (
    item.role.trim() === "chirurgien" ||
    item.role.trim() === "anesthesiste"
)
 {
    checklist = "✅ Checklist verified";
}
else{

            try {

                const parsed = JSON.parse(item.checklist);

                parsed.forEach(el => {

                    if (el.item) {
                        checklist +=` 
                            ✓ ${el.item} :
                            ${el.checked ? "Oui" : "Non"}
                            <br>
                        `;
                    }

                    if (el.patient) {
                        checklist +=` 
                            👤 Patient : ${el.patient}<br>
                        `;
                    }

                    if (el.dateNaissance) {
                        checklist +=` 
                            📅 Date naissance :
                            ${el.dateNaissance}<br>
                        `;
                    }

                    if (el.siteOperatoire) {
                        checklist += `
                            🏥 Site :
                            ${el.siteOperatoire}<br>`
                        ;
                    }

                });

            } catch {

                checklist = "Données non lisibles";

            }
        }
       

            html +=` 
                <tr>

                    <td>${item.id}</td>

                    <td>${item.nom}</td>

                    <td>${item.role}</td>

                    <td>${item.date}</td>

                    <td>${checklist}</td>

                </tr>
            `;
        });

        html +=` 
            </table>

            <br>

            <button onclick="retourAccueil()">
                ⬅ Retour
            </button>

        </div>
        `;

        document.getElementById("app").innerHTML = html;

    })

    .catch(err => {

        console.error(err);

        alert("❌ Erreur chargement historique");

    });
}

   
function retourAccueil() {
    location.reload();
}

function afficherChecklist(role) {

    let html = "";

   if (role === "infirmier") {
    
      html=`

        <h2>🩺 Checklist Infirmier</h2>

        <input type="text"  id="patient"
        class="input-chechlist"
        placeholder="Nom du patient"><br><br>

        <input type="date" id="dateNaissance" 
        class="input-chechlist"
        placeholder="Date de Naissance" ><br><br>

        <input type="text" id="siteOperatoire" 
        class="input-chechlist"
        placeholder="Site operatoire"><br><br>

        <input type="text" id="chirurgien"
        class="input-chechlist"
         placeholder="Chirurgien responsable"><br><br>

        <input type="text" id="anesthesiste" 
        class="input-chechlist"
        placeholder="Anesthésiste responsable"><br><br>

        <input type="text" id="allergies" 
        class="input-chechlist"
        placeholder="Allergies"><br><br>

        <input type="text" id="maladies"
        class="input-chechlist" 
        placeholder="Maladies chroniques"><br><br>

        <input type="text" id="traitement"
        class="input-chechlist"
         placeholder="Traitement en cours"><br><br>

        <button onclick="valider()">Valider</button>
    `;

    document.getElementById("app").innerHTML = html;
}
    

    else if (role === "chirurgien") {

    html =`
        <h2> Checklist Chirurgien</h2>

        

        <input type="text" placeholder="Type d’intervention">

        

        <label>
            <input type="checkbox">
            Bistouri électrique testé
        </label><br>

        <label>
            <input type="checkbox">
            Plaque neutre positionnée
        </label><br>

        <label>
            <input type="checkbox">
            Instruments stériles
        </label><br>

        <label>
            <input type="checkbox">
            Table opératoire OK
        </label><br>

        <label>
            <input type="checkbox">
            Éclairage OK
        </label><br>

        <label>
            <input type="checkbox">
            Aspirateur chirurgical OK
        </label><br>

        <button onclick="valider()">Valider</button>`
    ;

    document.getElementById("app").innerHTML = html;
}

    else if (role === "anesthesiste") {

    html =`
        <h2>💉 Checklist Anesthésiste</h2>

        <label>
            <input type="checkbox">
            Appareil d’anesthésie testé
        </label><br><br>

        <label>
            <input type="checkbox">
            Test du circuit
        </label><br><br>

        <label>
            <input type="checkbox">
            Pression O2
        </label><br><br>

        <label>
            <input type="checkbox">
            Pression CO2
        </label><br><br>

        <label>
            <input type="checkbox">
            Pression N2O
        </label><br><br>

        <label>
            <input type="checkbox">
            Pression air médical OK
        </label><br><br>

        <label>
            <input type="checkbox">
            Pression vide OK
        </label><br><br>

        <label>
            <input type="checkbox">
            Ventilateur fonctionnel
        </label><br><br>

        <label>
            <input type="checkbox">
            Moniteur fonctionnel
        </label><br><br>

        <label>
            <input type="checkbox">
            Défibrillateur testé
        </label><br><br>

        <label>
            <input type="checkbox">
            Aspirateur fonctionnel
        </label><br><br>

        <button onclick="valider()">Valider</button>`
    ;

    document.getElementById("app").innerHTML = html;
} 
}




