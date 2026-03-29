// Liste des images utilisées pour les niveaux du puzzle
const images = ["dob.png", "flamant.png", "oie.png", "kongourou.png", "gazelle.png"];

// Taille de la grille (3x3)
const taille = 3;

// Score et niveau courant
let score = 0;
let currentLevel = 0;

// Pièce en cours de déplacement (drag source)
let draggedPiece = null;

// Conteneur du puzzle dans le DOM
const container = document.getElementById("puzzle-container");

// Charge et affiche le puzzle pour un niveau donné
function loadPuzzle(level) {
    container.innerHTML = "";
    document.getElementById("message").textContent = "";
    document.getElementById("level-display").textContent = `Image ${level + 1} / ${images.length}`;

    const imageUrl = images[level];
    let pieces = [];

    // Création des pièces de la grille
    for (let row = 0; row < taille; row++) {
        for (let col = 0; col < taille; col++) {
            const el = document.createElement("div");
            el.classList.add("piece");
            el.draggable = true;

            // Position originale de la pièce (pour vérifier la victoire)
            el.dataset.originalRow = row;
            el.dataset.originalCol = col;

            // Affichage de la portion d'image correspondante
            el.style.backgroundImage = `url(${imageUrl})`;
            el.style.backgroundPosition = `-${col * 150}px -${row * 150}px`;
            el.style.backgroundSize = "450px 450px";

            pieces.push(el);
        }
    }

    // Mélange aléatoire des pièces
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(el => container.appendChild(el));

    // Activation du drag & drop
    addDragEvents();
}

// Ajoute les événements drag & drop sur toutes les pièces
function addDragEvents() {
    const allPieces = container.querySelectorAll(".piece");

    allPieces.forEach(el => {
        // Mémorise la pièce en cours de drag
        el.addEventListener("dragstart", () => {
            draggedPiece = el;
        });

        // Autorise le drop sur cette pièce
        el.addEventListener("dragover", e => e.preventDefault());

        // Échange le contenu visuel des deux pièces lors du drop
        el.addEventListener("drop", e => {
            e.preventDefault();
            if (draggedPiece === el) return;

            // Sauvegarde du contenu visuel de la pièce draggée
            const tempImage   = draggedPiece.style.backgroundImage;
            const tempPos     = draggedPiece.style.backgroundPosition;
            const tempOrigRow = draggedPiece.dataset.originalRow;
            const tempOrigCol = draggedPiece.dataset.originalCol;

            // Copie le contenu de la cible vers la pièce draggée
            draggedPiece.style.backgroundImage    = el.style.backgroundImage;
            draggedPiece.style.backgroundPosition = el.style.backgroundPosition;
            draggedPiece.dataset.originalRow      = el.dataset.originalRow;
            draggedPiece.dataset.originalCol      = el.dataset.originalCol;

            // Copie le contenu sauvegardé vers la cible
            el.style.backgroundImage    = tempImage;
            el.style.backgroundPosition = tempPos;
            el.dataset.originalRow      = tempOrigRow;
            el.dataset.originalCol      = tempOrigCol;

            // Vérifie si le puzzle est résolu
            checkVictory();
        });
    });
}

// Vérifie si toutes les pièces sont dans leur position originale
function checkVictory() {
    const allPieces = Array.from(container.children);
    const correct = allPieces.every((el, index) =>
        Math.floor(index / taille) == el.dataset.originalRow &&
        index % taille == el.dataset.originalCol
    );

    if (correct) {
        // Incrémente le score et affiche le message
        score++;
        document.getElementById("score-display").textContent = `Score : ${score} / ${images.length}`;
        document.getElementById("message").textContent = "🎉 Félicitations ! Puzzle terminé !";

        if (score >= images.length) {
            // Tous les puzzles résolus : affiche l'écran de victoire
            setTimeout(() => {
                document.getElementById("win-screen").style.display = "block";
                document.getElementById("btn-rejouer").style.display = "inline-block";
                container.style.pointerEvents = "none";
            }, 800);
        } else {
            // Passe au niveau suivant après un court délai
            currentLevel++;
            setTimeout(() => loadPuzzle(currentLevel), 1200);
        }
    }
}

// Réinitialise le jeu et repart du niveau 0
function restartGame() {
    score = 0;
    currentLevel = 0;
    document.getElementById("score-display").textContent = `Score : 0 / ${images.length}`;
    document.getElementById("message").textContent = "";
    document.getElementById("win-screen").style.display = "none";
    document.getElementById("btn-rejouer").style.display = "none";
    container.style.pointerEvents = "auto";
    loadPuzzle(0);
}

// Lancement du jeu au chargement de la page
loadPuzzle(0);
