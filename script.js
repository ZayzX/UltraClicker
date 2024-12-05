let score = 0; // Score total
let perClick = 1; // Points gagnés par clic
let perSecond = 0; // Points passifs gagnés par seconde
let rebirths = 0; // Nombre de rebirths effectués
let rebirthMultiplier = 1; // Multiplicateur de rebirth

// Liste de codes bonus et leurs effets
const bonusCodes = {
  "DOUBLECLICK": { effect: "click", value: 5, message: "Doubles your per-click bonus!" },
  "PASSIVEBOOST": { effect: "passive", value: 10, message: "Increases passive income!" },
  "INSTANTRESTART": { effect: "rebirth", value: 1, message: "Instant Rebirth!" },
  // Vous pouvez ajouter autant de codes bonus que vous voulez ici
};

// Simplifie les grands nombres (1k, 1M, etc.)
function simplifyNumber(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
  return num;
}

// Met à jour l'affichage des statistiques
function updateDisplay() {
  document.getElementById("score").textContent = simplifyNumber(score);
  document.getElementById("per-click").textContent = simplifyNumber(perClick);
  document.getElementById("per-second").textContent = simplifyNumber(perSecond);
  document.getElementById("rebirth-cost").textContent = simplifyNumber(Math.floor(1000 * Math.pow(1.5, rebirths)));
}

// Ajoute les points par clic
document.getElementById("click-button").addEventListener("click", () => {
  score += perClick * rebirthMultiplier;
  updateDisplay();
});

// Fonction pour créer les améliorations et améliorations passives
function createUpgrades() {
  let upgradesContainer = document.getElementById("upgrades");
  let passiveContainer = document.getElementById("passive-upgrades");

  for (let i = 1; i <= 150; i++) {
    // Améliorations de clic
    let upgrade = document.createElement("button");
    upgrade.classList.add("upgrade");
    upgrade.setAttribute("data-cost", 50 * i); // Le coût commence à 50 et augmente
    upgrade.setAttribute("data-value", i); // Le bonus de clic
    upgrade.setAttribute("data-type", "click");
    upgrade.textContent = `+${i} Per Click (${simplifyNumber(50 * i)})`;
    upgradesContainer.appendChild(upgrade);

    // Améliorations passives
    if (i <= 50) {
      let passiveUpgrade = document.createElement("button");
      passiveUpgrade.classList.add("upgrade");
      passiveUpgrade.setAttribute("data-cost", 100 * i); // Le coût commence à 100 et augmente
      passiveUpgrade.setAttribute("data-value", i); // Le bonus passif
      passiveUpgrade.setAttribute("data-type", "passive");
      passiveUpgrade.textContent = `+${i} Passive Income (${simplifyNumber(100 * i)})`;
      passiveContainer.appendChild(passiveUpgrade);
    }
  }
}

// Gère les améliorations
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("upgrade")) {
    const button = event.target;
    const cost = parseInt(button.getAttribute("data-cost"));
    const value = parseInt(button.getAttribute("data-value"));
    const type = button.getAttribute("data-type");

    if (score >= cost) {
      score -= cost;
      if (type === "click") {
        perClick += value;
      } else if (type === "passive") {
        perSecond += value;
      }

      // Double le prix pour la prochaine amélioration
      const newCost = Math.floor(cost * 2);
      button.setAttribute("data-cost", newCost); 
      button.textContent = `+${value} ${type === "click" ? "Per Click" : "Passive Income"} (${simplifyNumber(newCost)})`;
      updateDisplay();
    } else {
      alert("Not enough score!");
    }
  }
});

// Gagne des points passifs automatiquement
setInterval(() => {
  score += perSecond * rebirthMultiplier;
  updateDisplay();
}, 1000); // Toutes les secondes

// Modal logic
let modalUpgrades = document.getElementById("upgrade-modal");
let modalPassive = document.getElementById("passive-modal");

let openUpgrades = document.getElementById("open-upgrades");
let openPassive = document.getElementById("open-passive");

let closeUpgrades = document.getElementById("close-upgrades");
let closePassive = document.getElementById("close-passive");

// Ouvrir les modales
openUpgrades.onclick = function() {
  modalUpgrades.style.display = "block";
}
openPassive.onclick = function() {
  modalPassive.style.display = "block";
}

// Fermer les modales
closeUpgrades.onclick = function() {
  modalUpgrades.style.display = "none";
}
closePassive.onclick = function() {
  modalPassive.style.display = "none";
}

// Fermer les modales si on clique en dehors de la fenêtre
window.onclick = function(event) {
  if (event.target === modalUpgrades) {
    modalUpgrades.style.display = "none";
  }
  if (event.target === modalPassive) {
    modalPassive.style.display = "none";
  }
}

// Créer les améliorations
createUpgrades();

// Fonction de rebirth
document.getElementById("rebirth-button").addEventListener("click", () => {
  let rebirthCost = Math.floor(1000 * Math.pow(1.5, rebirths));
  if (score >= rebirthCost) {
    // Effectuer le rebirth
    score -= rebirthCost;
    rebirths++;
    rebirthMultiplier *= 2; // Double les gains de clic et passifs
    perClick = 1; // Réinitialiser le score de clic
    perSecond = 0; // Réinitialiser le score passif
    updateDisplay(); // Mettre à jour l'affichage
    alert(`Rebirth successful! You now have a ${rebirthMultiplier}x multiplier.`);
  } else {
    alert("You don't have enough score for a rebirth!");
  }
});

// Gestion des codes bonus
document.getElementById("apply-bonus-code").addEventListener("click", () => {
  const code = document.getElementById("bonus-code").value.toUpperCase();
  const statusText = document.getElementById("code-status");

  if (bonusCodes[code]) {
    const bonus = bonusCodes[code];
    
    // Applique l'effet du code
    if (bonus.effect === "click") {
      perClick += bonus.value;
      statusText.textContent = `Bonus Applied: ${bonus.message}`;
    } else if (bonus.effect === "passive") {
      perSecond += bonus.value;
      statusText.textContent = `Bonus Applied: ${bonus.message}`;
    } else if (bonus.effect === "rebirth") {
      // Instant rebirth
      score = 0;
      perClick = 1;
      perSecond = 0;
      rebirths = 0;
      rebirthMultiplier = 1;
      statusText.textContent = `Bonus Applied: ${bonus.message}`;
    }

    // Réinitialiser le champ de code
    document.getElementById("bonus-code").value = "";
    updateDisplay();
  } else {
    statusText.textContent = "Invalid code!";
  }
});