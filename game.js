const ANIMALS = {
  dragonborn: {
    name: "Dragonborn",
    emoji: "🐉",
    description: "Dragonborn wield the raw power and arcane fire of their dragon ancestors.",
    stats: { strength: 4, speed: 2, magic: 4, wisdom: 2, luck: 1 }
  },
  loxodon: {
    name: "Loxodon",
    emoji: "🐘",
    description: "Loxodons carry immense strength and ancient wisdom in equal measure.",
    stats: { strength: 4, speed: 1, magic: 1, wisdom: 5, luck: 2 }
  },
  centaur: {
    name: "Centaur",
    emoji: "🐴",
    description: "Centaurs gallop across the battlefield with unmatched speed and grace.",
    stats: { strength: 3, speed: 5, magic: 1, wisdom: 2, luck: 2 }
  },
  owlin: {
    name: "Owlin",
    emoji: "🦉",
    description: "Owlins see truths others miss, guided by deep and silent wisdom.",
    stats: { strength: 1, speed: 2, magic: 3, wisdom: 5, luck: 2 }
  },
  harengon: {
    name: "Harengon",
    emoji: "🐰",
    description: "Harengons bound through danger with uncanny luck and nimble feet.",
    stats: { strength: 1, speed: 4, magic: 1, wisdom: 2, luck: 5 }
  },
  thrikreen: {
    name: "Thri-kreen",
    emoji: "🐞",
    description: "Thri-kreen skitter through chaos, always landing on the lucky side.",
    stats: { strength: 2, speed: 3, magic: 2, wisdom: 2, luck: 4 }
  },
  fairy: {
    name: "Fairy",
    emoji: "🧚",
    description: "Fairies shimmer with pure magical energy drawn from the Feywild.",
    stats: { strength: 1, speed: 3, magic: 5, wisdom: 3, luck: 1 }
  },
  unitaur: {
    name: "Unitaur",
    emoji: "🦄",
    description: "Unitaurs channel radiant magic through their spiraling horn.",
    stats: { strength: 2, speed: 2, magic: 5, wisdom: 3, luck: 1 }
  }
};

const ROLES = {
  cleric: {
    name: "Cleric",
    emoji: "⚕️",
    description: "Clerics channel divine power to heal allies and smite evil.",
    stats: { strength: 2, speed: 1, magic: 3, wisdom: 4, luck: 2 }
  },
  fighter: {
    name: "Fighter",
    emoji: "⚔️",
    description: "Fighters train every day to become unstoppable in battle.",
    stats: { strength: 5, speed: 2, magic: 0, wisdom: 1, luck: 1 }
  },
  rogue: {
    name: "Rogue",
    emoji: "🗡️",
    description: "Rogues strike from the shadows with precision and cunning.",
    stats: { strength: 2, speed: 4, magic: 1, wisdom: 2, luck: 4 }
  },
  wizard: {
    name: "Wizard",
    emoji: "🧙",
    description: "Wizards bend the fabric of reality with ancient spells.",
    stats: { strength: 0, speed: 2, magic: 5, wisdom: 4, luck: 2 }
  }
};

const STAT_NAMES = ["strength", "speed", "magic", "wisdom", "luck"];
const STAT_LABELS = { strength: "Strength", speed: "Speed", magic: "Magic", wisdom: "Wisdom", luck: "Luck" };
const STAT_ICONS = { strength: "💪", speed: "⚡", magic: "✨", wisdom: "📖", luck: "🍀" };

let selectedAnimal = null;
let selectedAppearance = null;
let selectedRole = null;
let characterName = "";

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function renderStars(value) {
  const max = 10;
  const filled = Math.min(value, max);
  const empty = Math.max(0, max - filled);
  return '<span class="star filled">★</span>'.repeat(filled) +
         '<span class="star empty">★</span>'.repeat(empty);
}

function buildCharacterSheet() {
  const animal = ANIMALS[selectedAnimal];
  const role = ROLES[selectedRole];

  document.getElementById("charTitle").textContent =
    `${characterName} the ${animal.name} ${role.name}`;

  const img = document.getElementById("charImage");
  const fallback = document.getElementById("charImageFallback");
  img.src = `images/${selectedAnimal}-appearance-${selectedAppearance}.png`;
  img.alt = `${animal.name} ${role.name}`;
  img.style.display = "";
  fallback.style.display = "none";
  fallback.textContent = animal.emoji;

  document.getElementById("animalDesc").textContent = `🐾 ${animal.description}`;
  document.getElementById("roleDesc").textContent = `⚔️ ${role.description}`;

  const statsList = document.getElementById("statsList");
  statsList.innerHTML = "";
  STAT_NAMES.forEach(stat => {
    const total = animal.stats[stat] + role.stats[stat];
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <span class="stat-icon">${STAT_ICONS[stat]}</span>
      <span class="stat-name">${STAT_LABELS[stat]}</span>
      <span class="stat-stars">${renderStars(total)}</span>
      <span class="stat-number">(${total})</span>
    `;
    statsList.appendChild(row);
  });
}

// Page 1 logic
const charNameInput = document.getElementById("charName");
const toPage1bBtn = document.getElementById("toPage1b");

function checkPage1Ready() {
  toPage1bBtn.disabled = !(characterName.trim().length > 0 && selectedAnimal !== null);
}

charNameInput.addEventListener("input", () => {
  characterName = charNameInput.value;
  checkPage1Ready();
});

document.querySelectorAll(".animal-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".animal-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedAnimal = card.dataset.animal;
    checkPage1Ready();
  });
});

toPage1bBtn.addEventListener("click", () => {
  const animal = ANIMALS[selectedAnimal];
  document.getElementById("page1bSubtitle").textContent =
    `Pick an appearance for your ${animal.name}`;
  buildAppearancePage();
  showPage("page1b");
});

// Page 1b: Appearance logic
const toPage2Btn = document.getElementById("toPage2");

function buildAppearancePage() {
  selectedAppearance = null;
  toPage2Btn.disabled = true;
  const grid = document.getElementById("appearanceGrid");
  grid.innerHTML = "";
  const animal = ANIMALS[selectedAnimal];
  for (let i = 1; i <= 3; i++) {
    const card = document.createElement("div");
    card.className = "card appearance-card";
    card.dataset.appearance = i;
    card.innerHTML = `
      <div class="card-image">
        <img src="images/${selectedAnimal}-appearance-${i}.png" alt="${animal.name} look ${i}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="placeholder-img" style="display:none">${animal.emoji}</div>
      </div>
      <h3>Look ${i}</h3>
    `;
    card.addEventListener("click", () => {
      grid.querySelectorAll(".appearance-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedAppearance = i;
      toPage2Btn.disabled = false;
    });
    grid.appendChild(card);
  }
}

toPage2Btn.addEventListener("click", () => {
  document.getElementById("page2Subtitle").textContent =
    `${characterName} the ${ANIMALS[selectedAnimal].name} — what will you become?`;
  showPage("page2");
});

// Page 2 logic
const toPage3Btn = document.getElementById("toPage3");

document.querySelectorAll(".role-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".role-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedRole = card.dataset.role;
    toPage3Btn.disabled = false;
  });
});

toPage3Btn.addEventListener("click", () => {
  buildCharacterSheet();
  showPage("page3");
});

// Page 3 logic
document.getElementById("startOver").addEventListener("click", () => {
  selectedAnimal = null;
  selectedAppearance = null;
  selectedRole = null;
  characterName = "";
  charNameInput.value = "";
  document.querySelectorAll(".animal-card, .role-card").forEach(c => c.classList.remove("selected"));
  toPage1bBtn.disabled = true;
  toPage2Btn.disabled = true;
  toPage3Btn.disabled = true;
  showPage("page1");
});
