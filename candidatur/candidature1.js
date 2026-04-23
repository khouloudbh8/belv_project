// ============================================================
// (a) Fonction Constructeur — définition de l'objet Animal
// ============================================================
function Animal(espece, domaine, creneaux, nbBenevoles) {
  this.espece      = espece;       // ex: "Lion"
  this.domaine     = domaine;      // ex: "Soin des Animaux"
  this.creneaux    = creneaux;     // ex: ["Matin Lun", "Après-midi Mer"]
  this.nbBenevoles = nbBenevoles;  // nombre de bénévoles nécessaires
}

// ============================================================
// (b) Collection — tableau initialisé avec des objets réels
// ============================================================
const animaux = [
  new Animal("Lion",               "Soin des Animaux", ["Matin Lun", "Matin Mer", "Après-midi Ven"],           3),
  new Animal("Singe",    "Sensibilisation",  ["Matin Mar", "Après-midi Mar", "Matin Sam"],           2),
  new Animal("Dromadaire",         "Espaces Verts",    ["Matin Lun", "Après-midi Mer", "Après-midi Sam"],      4),
  new Animal("Éléphant", "Espaces Verts",    ["Matin Sam", "Après-midi Sam", "Matin Dim"],           3),
  new Animal("Tigre du Bengale",   "Soin des Animaux", ["Matin Lun", "Après-midi Lun", "Matin Ven"],           5),
  new Animal("Zèbre",              "Sensibilisation",  ["Matin Mer", "Matin Jeu", "Après-midi Jeu"],           2),
  new Animal("Gazelle",            "Espaces Verts",    ["Après-midi Lun", "Après-midi Mar", "Matin Dim"],      1),
  new Animal("Flamant rose",       "Soin des Animaux", ["Matin Mar", "Après-midi Jeu", "Matin Sam"],           2),
  new Animal("Crocodile du Nil",   "Soin des Animaux", ["Matin Mer", "Après-midi Mer", "Après-midi Ven"],      4),
  new Animal("Hyène",              "Sensibilisation",  ["Après-midi Mar", "Après-midi Mer", "Après-midi Sam"], 2),
];

// ============================================================
// Constantes jours / périodes pour le tableau des disponibilités
// ============================================================
const JOURS    = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const PERIODES = ["Matin", "Après-midi"];

// ============================================================
// (c) Génération dynamique du tableau
// ============================================================
function afficherTableau(liste) {
  const tbody = document.querySelector("#tableau-animaux tbody");
  tbody.innerHTML = "";
  if (liste.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="td-vide">Aucun résultat trouvé.</td></tr>`;
    return;
  }
  liste.forEach(function(a) { ajouterLigne(a); });
}

// ============================================================
// (d) Fonction 1 — ajouterLigne(animal)
// ============================================================
function ajouterLigne(animal) {
  const tbody = document.querySelector("#tableau-animaux tbody");
  const tr    = document.createElement("tr");

  const creneauxHtml = animal.creneaux.map(function(c) {
    const isMatin = c.startsWith("Matin");
    return `<span class="badge ${isMatin ? 'badge-matin' : 'badge-aprem'}">${c}</span>`;
  }).join(" ");

  const domaineClass = {
    "Soin des Animaux" : "domaine-soin",
    "Espaces Verts"    : "domaine-vert",
    "Sensibilisation"  : "domaine-sensi"
  }[animal.domaine] || "";

  const urgence = animal.nbBenevoles >= 4 ? "urgence-haute" :
                  animal.nbBenevoles >= 2 ? "urgence-moyenne" : "urgence-basse";

  // Bouton supprimer uniquement pour les lignes ajoutées manuellement
  const btnSupprimer = animal.ajouteManuellement
    ? `<button class="btn-supprimer" onclick="supprimerAnimal('${animal.espece}', this)">🗑️</button>`
    : "";

  tr.innerHTML = `
    <td class="td-animal">
      <span class="animal-icon">${iconeAnimal(animal.espece)}</span>
      <strong>${animal.espece}</strong>
    </td>
    <td><span class="tag-domaine ${domaineClass}">${animal.domaine}</span></td>
    <td class="td-creneaux">${creneauxHtml}</td>
    <td><span class="nb-benevoles ${urgence}">${animal.nbBenevoles} bénévole${animal.nbBenevoles > 1 ? 's' : ''}</span></td>
    <td class="td-actions">
      <button class="btn-postuler" onclick="postuler('${animal.espece}')">Postuler</button>
      ${btnSupprimer}
    </td>
  `;
  tbody.appendChild(tr);
}

// ============================================================
// Supprimer une ligne ajoutée manuellement
// ============================================================
function supprimerAnimal(espece, btn) {
  // Supprimer du tableau JS
  const index = animaux.findIndex(function(a) { return a.espece === espece; });
  if (index !== -1) animaux.splice(index, 1);

  // Supprimer la ligne du DOM
  btn.closest("tr").remove();

  // Supprimer l'option du select espèce liée
  const select = document.getElementById("select-espece-liee");
  const option = select.querySelector(`option[value="${espece}"]`);
  if (option) option.remove();

  // Mettre à jour le compteur
  document.getElementById("compteur").textContent = `${animaux.length} espèces affichées`;
}

// ============================================================
// Icône selon l'espèce
// ============================================================
function iconeAnimal(espece) {
  const map = {
    "Lion"               : "🦁",
    "Singe"    : "🐒",
    "Dromadaire"         : "🐫",
    "Éléphant" : "🐘",
    "Tigre du Bengale"   : "🐯",
    "Zèbre"              : "🦓",
    "Gazelle"            : "🦒",
    "Flamant rose"       : "🦩",
    "Crocodile du Nil"   : "🐊",
    "Hyène"              : "🦊",
  };
  return map[espece] || "🐾";
}

// ============================================================
// CAS 1 — Postuler depuis le tableau
// Pré-remplit : espèce, domaine, créneaux, motivation
// ============================================================
function postuler(espece) {
  const animal = animaux.find(function(a) { return a.espece === espece; });
  if (!animal) return;

  // Pré-remplir le select espèce liée
  const selectEspece = document.getElementById("select-espece-liee");
  if (selectEspece) selectEspece.value = animal.espece;

  // Cocher les créneaux dans le tableau des disponibilités
  mettreAJourTableauDispo(animal.creneaux);

  // Pré-cocher le domaine
  document.querySelectorAll(".case-element input[type='checkbox']").forEach(function(cb) {
    cb.checked = cb.parentElement.textContent.trim() === animal.domaine;
  });

  // Pré-remplir motivation
  const motivation = document.getElementById("motivations");
  if (motivation) {
    motivation.value = `Je souhaite contribuer au domaine "${animal.domaine}" pour les ${animal.espece}s du zoo.`;
  }

  // Cacher toute suggestion manuelle
  cacherSuggestion();

  // Scroll vers le formulaire
  document.querySelector(".carte-formulaire").scrollIntoView({ behavior: "smooth" });
}

// ============================================================
// Pré-cocher les cases du tableau dispo selon les créneaux
// ============================================================
function mettreAJourTableauDispo(creneaux) {
  document.querySelectorAll(".tableau-disponibilites input[type='checkbox']").forEach(function(cb) {
    cb.checked = false;
  });

  creneaux.forEach(function(creneau) {
    const parties      = creneau.split(" ");
    const periode      = parties[0];           // "Matin" ou "Après-midi"
    const jour         = parties[1];           // "Lun", "Mar"...
    const periodeIndex = PERIODES.indexOf(periode);
    const jourIndex    = JOURS.indexOf(jour);
    if (periodeIndex === -1 || jourIndex === -1) return;

    const lignes = document.querySelectorAll(".tableau-disponibilites tbody tr");
    if (lignes[periodeIndex]) {
      const cases = lignes[periodeIndex].querySelectorAll("input[type='checkbox']");
      if (cases[jourIndex]) cases[jourIndex].checked = true;
    }
  });
}

// ============================================================
// CAS 2 — Remplissage manuel → suggestion d'espèce
// ============================================================
function detecterAnimalSuggere() {
  const creneauxCoches = [];

  document.querySelectorAll(".tableau-disponibilites tbody tr").forEach(function(ligne, periodeIndex) {
    ligne.querySelectorAll("input[type='checkbox']").forEach(function(cb, jourIndex) {
      if (cb.checked) {
        creneauxCoches.push(PERIODES[periodeIndex] + " " + JOURS[jourIndex]);
      }
    });
  });

  if (creneauxCoches.length === 0) {
    cacherSuggestion();
    return;
  }

  // Trouver l'animal avec le plus de créneaux en commun
  let meilleurAnimal = null;
  let maxCommun = 0;

  animaux.forEach(function(a) {
    const communs = a.creneaux.filter(function(c) {
      return creneauxCoches.indexOf(c) !== -1;
    });
    if (communs.length > maxCommun) {
      maxCommun      = communs.length;
      meilleurAnimal = a;
    }
  });

  if (meilleurAnimal) {
    afficherSuggestion(meilleurAnimal, maxCommun);
  } else {
    cacherSuggestion();
  }
}

// ============================================================
// Affiche la suggestion sous le tableau des disponibilités
// ============================================================
function afficherSuggestion(animal, nbCommun) {
  const zone = document.getElementById("zone-suggestion");
  const domaineClass = {
    "Soin des Animaux" : "domaine-soin",
    "Espaces Verts"    : "domaine-vert",
    "Sensibilisation"  : "domaine-sensi"
  }[animal.domaine] || "";

  zone.innerHTML = `
    <div class="suggestion-carte">
      <span class="suggestion-icone">${iconeAnimal(animal.espece)}</span>
      <div class="suggestion-texte">
        Les <strong>${animal.espece}s</strong> ont besoin de bénévoles sur
        <strong>${nbCommun} de vos créneaux</strong> !
        <span class="tag-domaine ${domaineClass} suggestion-tag">${animal.domaine}</span>
      </div>
      <button class="btn-suggestion" onclick="postuler('${animal.espece}')">
        Postuler pour les ${animal.espece}s →
      </button>
    </div>
  `;
  zone.style.display = "block";
}

function cacherSuggestion() {
  const zone = document.getElementById("zone-suggestion");
  zone.innerHTML = "";
  zone.style.display = "none";
}

// ============================================================
// (d) Fonction 2 — rechercherAnimaux(terme)
// ============================================================
function rechercherAnimaux(terme) {
  terme = terme.toLowerCase().trim();
  if (terme === "") {
    afficherTableau(animaux);
    document.getElementById("compteur").textContent = `${animaux.length} espèces affichées`;
    return;
  }
  const resultats = animaux.filter(function(a) {
    return (
      a.espece.toLowerCase().includes(terme)  ||
      a.domaine.toLowerCase().includes(terme) ||
      a.creneaux.some(function(c) { return c.toLowerCase().includes(terme); })
    );
  });
  afficherTableau(resultats);
  document.getElementById("compteur").textContent =
    `${resultats.length} résultat${resultats.length !== 1 ? 's' : ''} trouvé${resultats.length !== 1 ? 's' : ''}`;
}

// ============================================================
// (e) Formulaire 1 — Ajouter un animal
// ============================================================
document.getElementById("form-ajouter").addEventListener("submit", function(e) {
  e.preventDefault();

  const espece = document.getElementById("input-espece").value.trim();
  const domaine= document.getElementById("input-domaine").value;
  const nb     = parseInt(document.getElementById("input-nb").value);

  const creneauxCoches = [];
  document.querySelectorAll("#form-ajouter input[type='checkbox']:checked").forEach(function(cb) {
    creneauxCoches.push(cb.value);
  });

  if (!espece || creneauxCoches.length === 0) {
    alert("Veuillez renseigner l'espèce et sélectionner au moins un créneau.");
    return;
  }

  const nouvelAnimal = new Animal(espece, domaine, creneauxCoches, nb);
  nouvelAnimal.ajouteManuellement = true;
  animaux.push(nouvelAnimal);

  // Ajouter au select espèce liée dans le formulaire candidature
  const option = document.createElement("option");
  option.value       = nouvelAnimal.espece;
  option.textContent = `${iconeAnimal(nouvelAnimal.espece)} ${nouvelAnimal.espece}`;
  document.getElementById("select-espece-liee").appendChild(option);

  afficherTableau(animaux);
  document.getElementById("compteur").textContent = `${animaux.length} espèces affichées`;
  this.reset();
  document.querySelector("#section-tableau").scrollIntoView({ behavior: "smooth" });
});

// ============================================================
// (e) Formulaire 2 — Recherche en temps réel
// ============================================================
document.getElementById("input-recherche").addEventListener("input", function() {
  rechercherAnimaux(this.value);
});

document.getElementById("btn-reset-recherche").addEventListener("click", function() {
  document.getElementById("input-recherche").value = "";
  rechercherAnimaux("");
});

// Écouter les cases du tableau des disponibilités → CAS 2
document.querySelectorAll(".tableau-disponibilites input[type='checkbox']").forEach(function(cb) {
  cb.addEventListener("change", detecterAnimalSuggere);
});

// Écouter le changement du select espèce
document.getElementById("select-espece-liee").addEventListener("change", function() {
  if (this.value === "libre") {
    // Vider toutes les cases — le candidat remplit librement
    document.querySelectorAll(".tableau-disponibilites input[type='checkbox']").forEach(function(cb) {
      cb.checked = false;
    });
    cacherSuggestion();
    document.querySelectorAll(".case-element input[type='checkbox']").forEach(function(cb) {
      cb.checked = false;
    });
    document.getElementById("motivations").value = "";
  } else if (this.value !== "") {
    // Espèce réelle sélectionnée → pré-remplir comme un Postuler
    postuler(this.value);
  } else {
    // Option vide → tout réinitialiser
    document.querySelectorAll(".tableau-disponibilites input[type='checkbox']").forEach(function(cb) {
      cb.checked = false;
    });
    cacherSuggestion();
  }
});

// ============================================================
// Initialisation au chargement
// ============================================================
window.addEventListener("DOMContentLoaded", function() {
  afficherTableau(animaux);
  document.getElementById("compteur").textContent = `${animaux.length} espèces affichées`;

  // Remplir le select espèce liée
  const select = document.getElementById("select-espece-liee");
  animaux.forEach(function(a) {
    const option = document.createElement("option");
    option.value       = a.espece;
    option.textContent = `${iconeAnimal(a.espece)} ${a.espece}`;
    select.appendChild(option);
  });
});