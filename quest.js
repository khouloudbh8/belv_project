// Écoute la soumission du formulaire
document.getElementById("formulaire").addEventListener("submit", function(e) {
    e.preventDefault();

    let valid = true;       // Indique si tous les champs sont valides
    let errors = [];        // Liste des messages d'erreur à afficher dans l'alerte

    // Affiche un message d'erreur sous un champ et l'ajoute à la liste
    function showError(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; }
        errors.push(msg);
        valid = false;
    }

    // Efface le message d'erreur d'un champ
    function clearError(id) {
        const el = document.getElementById(id);
        if (el) { el.textContent = ""; }
    }

    // 1. Validation du nom (textbox) — minimum 3 caractères
    const nom = document.getElementById("nom");
    clearError("err-nom");
    nom.classList.remove("invalide");
    if (nom.value.trim().length < 3) {
        nom.classList.add("invalide");
        showError("err-nom", "Le nom doit contenir au moins 3 caractères.");
    }

    // 2. Validation de l'email (textbox) — format valide avec regex
    const email = document.getElementById("email");
    clearError("err-email");
    email.classList.remove("invalide");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add("invalide");
        showError("err-email", "Veuillez entrer un email valide.");
    }

    // 3. Validation de la fréquence (radio) — au moins un choix obligatoire
    clearError("err-frequence");
    const frequenceChoisie = document.querySelector('input[name="frequence"]:checked');
    if (!frequenceChoisie) {
        showError("err-frequence", "Veuillez sélectionner une fréquence de visite.");
    }

    // 4. Validation de la compagnie (checkbox) — au moins une case cochée
    clearError("err-compagnie");
    const compagnieChoisie = document.querySelectorAll('input[name="compagnie"]:checked');
    if (compagnieChoisie.length === 0) {
        showError("err-compagnie", "Veuillez sélectionner au moins une option.");
    }

    // 5. Validation de l'avis (textarea) — champ non vide
    const avis = document.getElementById("avis");
    clearError("err-avis");
    avis.classList.remove("invalide");
    if (avis.value.trim() === "") {
        avis.classList.add("invalide");
        showError("err-avis", "Veuillez donner votre avis général.");
    }

    // Si des erreurs existent, affiche une alerte récapitulative
    if (!valid) {
        alert("Veuillez corriger les erreurs suivantes :\n\n" + errors.map((msg, i) => (i + 1) + ". " + msg).join("\n"));
    } else {
        // Formulaire valide : confirmation et réinitialisation
        alert("Formulaire envoyé avec succès !");
        this.reset();
        document.getElementById("note-val").textContent = "5";
    }
});
