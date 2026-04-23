/**
 * 1. CONFIGURATION ET DONNÉES
 */
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const PERIODES = ["Matin", "Après-midi"];

function Animal(espece, domaine, creneaux, nbBenevoles) {
    this.espece = espece;
    this.domaine = domaine;
    this.creneaux = creneaux;
    this.nbBenevoles = nbBenevoles;
}

const animaux = [
    new Animal("Lion", "Soin des Animaux", ["Matin Lun", "Matin Mer", "Après-midi Ven"], 3),
    new Animal("Singe (Babouin)", "Sensibilisation", ["Matin Mar", "Après-midi Mar", "Matin Sam"], 2),
    new Animal("Dromadaire", "Espaces Verts", ["Matin Lun", "Après-midi Mer", "Après-midi Sam"], 4),
    new Animal("Éléphant d'Afrique", "Espaces Verts", ["Matin Sam", "Après-midi Sam", "Matin Dim"], 3),
    new Animal("Tigre du Bengale", "Soin des Animaux", ["Matin Lun", "Après-midi Lun", "Matin Ven"], 5),
    new Animal("Zèbre", "Sensibilisation", ["Matin Mer", "Matin Jeu", "Après-midi Jeu"], 2),
    new Animal("Gazelle", "Espaces Verts", ["Après-midi Lun", "Après-midi Mar", "Matin Dim"], 1),
    new Animal("Flamant rose", "Soin des Animaux", ["Matin Mar", "Après-midi Jeu", "Matin Sam"], 2),
    new Animal("Crocodile du Nil", "Soin des Animaux", ["Matin Mer", "Après-midi Mer", "Après-midi Ven"], 4),
    new Animal("Hyène", "Sensibilisation", ["Après-midi Mar", "Après-midi Mer", "Après-midi Sam"], 2),
];

/**
 * 2. FONCTIONS D'AFFICHAGE
 */

const iconeAnimal = (e) => ({
    "Lion": "🦁", "Singe": "🐒", "Dromadaire": "🐫", "Éléphant d'Afrique": "🐘",
    "Tigre du Bengale": "🐯", "Zèbre": "🦓", "Gazelle": "🦒", "Flamant rose": "🦩",
    "Crocodile du Nil": "🐊", "Hyène": "🦊"
}[e] || "🐾");

function afficherTableau(liste) {
    const tbody = document.querySelector("#tableau-animaux tbody");
    const compteur = document.getElementById("compteur-resultats");
    
    tbody.innerHTML = liste.length ? "" : '<tr><td colspan="5" class="td-vide">Aucun résultat trouvé.</td></tr>';
    if(compteur) compteur.textContent = `${liste.length} espèce${liste.length > 1 ? 's':''} affichée${liste.length > 1 ? 's':''}`;

    liste.forEach(a => {
        // Détermination des classes CSS selon ton fichier
        const urgenceClass = a.nbBenevoles >= 4 ? "urgence-haute" : a.nbBenevoles >= 2 ? "urgence-moyenne" : "urgence-basse";
        const domaineClass = {"Soin des Animaux": "domaine-soin", "Espaces Verts": "domaine-vert", "Sensibilisation": "domaine-sensi"}[a.domaine] || "";
        
        const badges = a.creneaux.map(c => `
            <span class="badge ${c.startsWith("Matin") ? 'badge-matin' : 'badge-aprem'}">${c}</span>
        `).join("");

        tbody.insertAdjacentHTML('beforeend', `
            <tr>
                <td class="td-animal"><span class="animal-icon">${iconeAnimal(a.espece)}</span> <strong>${a.espece}</strong></td>
                <td><span class="tag-domaine ${domaineClass}">${a.domaine}</span></td>
                <td class="td-creneaux">${badges}</td>
                <td><span class="nb-benevoles ${urgenceClass}">${a.nbBenevoles} bénévole${a.nbBenevoles > 1 ? 's':''}</span></td>
                <td><button class="btn-postuler" onclick="postuler('${a.espece}')">Postuler</button></td>
            </tr>
        `);
    });
}

/**
 * 3. LOGIQUE CANDIDATURE & SUGGESTION
 */

function postuler(nom) {
    const a = animaux.find(i => i.espece === nom);
    if (!a) return;

    // Remplissage Select et Motivation
    const select = document.getElementById("select-espece-liee");
    if(select) select.value = a.espece;
    
    const motiv = document.getElementById("motivations");
    if(motiv) motiv.value = `Je souhaite contribuer au domaine "${a.domaine}" pour les ${a.espece}s du zoo.`;

    // Cocher le domaine (checkboxes circulaires)
    document.querySelectorAll(".case-element input").forEach(cb => {
        cb.checked = cb.parentElement.textContent.trim() === a.domaine;
    });

    // Cocher le planning
    mettreAJourPlanning(a.creneaux);
    cacherSuggestion();
    
    // Scroll fluide vers le formulaire
    document.querySelector(".carte-formulaire").scrollIntoView({ behavior: "smooth" });
}

function mettreAJourPlanning(creneaux) {
    const cases = document.querySelectorAll(".tableau-disponibilites input[type='checkbox']");
    cases.forEach(c => c.checked = false);

    creneaux.forEach(c => {
        const [p, j] = c.split(" ");
        const r = PERIODES.indexOf(p), col = JOURS.indexOf(j);
        const target = document.querySelectorAll(".tableau-disponibilites tbody tr")[r]?.querySelectorAll("input")[col];
        if (target) target.checked = true;
    });
}

function detecterAnimalSuggere() {
    const coches = [];
    document.querySelectorAll(".tableau-disponibilites tbody tr").forEach((tr, r) => {
        tr.querySelectorAll("input").forEach((cb, c) => {
            if (cb.checked) coches.push(`${PERIODES[r]} ${JOURS[c]}`);
        });
    });

    if (!coches.length) return cacherSuggestion();

    let top = null, max = 0;
    animaux.forEach(a => {
        const score = a.creneaux.filter(c => coches.includes(c)).length;
        if (score > max) { max = score; top = a; }
    });

    top ? afficherSuggestion(top, max) : cacherSuggestion();
}

/**
 * 4. ÉVÉNEMENTS ET INITIALISATION
 */

// Recherche
document.getElementById("input-recherche")?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    afficherTableau(animaux.filter(a => a.espece.toLowerCase().includes(val) || a.domaine.toLowerCase().includes(val)));
});

// Ajouter via formulaire
document.getElementById("form-ajouter")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const nom = document.getElementById("input-espece").value;
    const dom = document.getElementById("input-domaine").value;
    const nb = parseInt(document.getElementById("input-nb").value);
    const coches = Array.from(this.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);

    if (nom && coches.length) {
        animaux.push(new Animal(nom, dom, coches, nb));
        afficherTableau(animaux);
        this.reset();
    }
});

// Setup au chargement
window.onload = () => {
    afficherTableau(animaux);
    
    const select = document.getElementById("select-espece-liee");
    animaux.forEach(a => {
        if(select) select.insertAdjacentHTML('beforeend', `<option value="${a.espece}">${iconeAnimal(a.espece)} ${a.espece}</option>`);
    });

    document.querySelectorAll(".tableau-disponibilites input").forEach(cb => {
        cb.addEventListener("change", detecterAnimalSuggere);
    });
};

// Fonctions Suggestion (utilisant tes classes .suggestion-carte, .btn-suggestion, etc.)
function afficherSuggestion(a, n) {
    const z = document.getElementById("zone-suggestion");
    if(!z) return;
    z.style.display = "block";
    const domClass = {"Soin des Animaux": "domaine-soin", "Espaces Verts": "domaine-vert", "Sensibilisation": "domaine-sensi"}[a.domaine] || "";
    
    z.innerHTML = `
        <div class="suggestion-carte">
            <span class="suggestion-icone">${iconeAnimal(a.espece)}</span>
            <div class="suggestion-texte">
                Les <strong>${a.espece}s</strong> ont besoin de vous sur <strong>${n} créneaux</strong> !
                <span class="tag-domaine ${domClass} suggestion-tag">${a.domaine}</span>
            </div>
            <button class="btn-suggestion" onclick="postuler('${a.espece}')">Postuler →</button>
        </div>`;
}

function cacherSuggestion() { 
    const z = document.getElementById("zone-suggestion");
    if(z) z.style.display = "none"; 
}