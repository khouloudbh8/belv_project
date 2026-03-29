
const news = [
  {
    badge: "Journée spéciale oiseaux 🦜",
    image: "image/oiseau.png",
    date: "27 Avr, 2025",
    text: "Une journée éducative sera organisée pour découvrir le monde fascinant des oiseaux, avec des ateliers et des activités pour les enfants."
  },
  {
    badge: "Nouvel oiseau au zoo 🦆",
    image: "image/oisea2.png",
    date: "05 Mai, 2025",
    text: "Le zoo accueille un magnifique canard mandarin, célèbre pour ses couleurs vives. Les visiteurs peuvent désormais l’observer dans la volière des oiseaux exotiques."
  },
  {
    badge: "Naissance au zoo 🦁",
    image: "image/lionceau.png",
    date: "18 Mai, 2025",
    text: "Un lionceau est né cette semaine au zoo. Il est en bonne santé et reste sous la surveillance des soigneurs aux côtés de sa mère. Les visiteurs pourront bientôt le découvrir."
  },
  {
    badge: "Journée de nourrissage des animaux 🐾",
    image: "image/feed.png",
    date: "30 Mai, 2025",
    text: "Le zoo organise une journée spéciale où les visiteurs peuvent assister au nourrissage des animaux. Les soigneurs expliquent leur alimentation et leurs habitudes de vie."
  },
  {
    badge: "Nouveau parc écologique 🌱",
    image: "image/parc.png",
    date: "16 Janv, 2025",
    text: "Un espace naturel conçu pour protéger la faune, la flore et sensibiliser les visiteurs à l’environnement."
  },
  {
    badge: "Programme de conservation 🦁",
    image: "image/lion.jpg",
    date: "18 Mars, 2025",
    text: "Notre zoo participe à un programme international pour protéger les lions."
  },
  {
    badge: "Visite guidée du zoo 🗺️",
    image: "image/visite.webp",
    date: "10 Juin, 2025",
    text: "Des visites guidées sont organisées pour permettre aux visiteurs de découvrir les différentes espèces et mieux comprendre leur mode de vie."
  },
  {
    badge: "Atelier éducatif pour enfants 🎓",
    image: "image/enfant.webp",
    date: "22 Juin, 2025",
    text: "Des ateliers ludiques sont proposés aux enfants afin de les sensibiliser à la protection des animaux et de la nature."
  }
];

const container = document.getElementById("cartes-container");

news.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("carte");

    card.innerHTML = `
        <span class="badge">${item.badge}</span>
        <img src="${item.image}" alt="">
        <h1 class="date">${item.date}</h1>
        <p>${item.text}</p>
    `;

    container.appendChild(card);
});
