let player = {
    name: "Hero",
    health: 100,
    gold: 15,
    reputation: 0,
    inventory: [],
    hasMap: false,
    day: 1
};

let dragonHP = 150;

const textEl = document.getElementById('game-text');
const choiceEl = document.getElementById('choices');
const logEl = document.getElementById('system-log');
const hpEl = document.getElementById('hp');
const goldEl = document.getElementById('gold');
const repEl = document.getElementById('rep');

function updateUI() {
    hpEl.innerText = player.health;
    goldEl.innerText = player.gold;
    repEl.innerText = player.reputation;
}

function writeStory(text) {
    const p = document.createElement('p');
    p.style.marginBottom = "15px";
    p.innerHTML = text;
    
    // Add the dramatic highlight class
    p.classList.add('new-story-line');
    
    textEl.appendChild(p);
    
    // Smooth scroll
    textEl.scrollTo({
        top: textEl.scrollHeight,
        behavior: 'smooth'
    });

    // Clean up class after animation
    setTimeout(() => { p.classList.remove('new-story-line'); }, 1200);
}

function writeLog(msg) {
    const entry = document.createElement('div');
    entry.className = "log-entry";
    entry.innerText = `> ${msg}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

function clearChoices() {
    choiceEl.innerHTML = "";
}

function addChoice(text, action) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = () => {
        player.day++;
        action(btn);
    };
    choiceEl.appendChild(btn);
}

function gameOver(reason) {
    clearChoices();
    updateUI();
    textEl.innerHTML = ""; 
    writeStory("<h1 style='color: #8b0000; text-align: center;'>GAME OVER</h1>");
    writeStory(`<p style='text-align: center;'>${reason}</p>`);
    writeStory("<hr style='border: 0; border-top: 1px solid #333;'>");
    writeStory("<b>Your Final Stats:</b>");
    writeStory(`* Days Survived: ${player.day}`);
    writeStory(`* Gold Collected: ${player.gold}`);
    writeStory(`* Reputation: ${player.reputation}`);
    addChoice("Begin a New Legend", startGame);
}

// --- GAME SCENES ---

function startGame() {
    player = { name: "Hero", health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false, day: 1 };
    dragonHP = 150;
    updateUI();
    textEl.innerHTML = "";
    logEl.innerHTML = "";
    
    writeStory("<b>Chapter 1: The Shadows of Oakhaven</b>");
    writeStory("The sun dips below the jagged horizon. In the village of North Crest, you find three hooded bandits cornering an elderly traveler. Their daggers glint in the dim light.");
    
    clearChoices();
    addChoice("Intervene: 'Leave him be!'", () => {
        player.reputation += 10; player.health -= 15; player.hasMap = true;
        player.inventory.push("Old Map");
        writeStory("You drive the bandits off but take a shallow cut. The man gives you an <b>Old Map</b> in thanks.");
        writeLog("Saved the traveler. HP -15, Received Map.");
        updateUI(); townGate();
    });
    
    addChoice("Observe from the darkness", () => {
        writeStory("You watch as they rob the man. You remain safe, but the memory haunts you.");
        writeLog("Chose the path of caution.");
        townGate();
    });
    
    addChoice("Join the bandits", () => {
        player.reputation -= 20; player.gold += 15;
        writeStory("You take a cut of the old man's gold. The villagers watch you with disgust.");
        writeLog("Aided the thieves. Gold +15, Rep -20.");
        updateUI(); townGate();
    });
}

function townGate() {
    clearChoices();
    writeStory("<b>Chapter 2: The Iron Gate</b>");
    writeStory("The Captain of the Guard demands a 5 gold toll to enter the city.");
    
    addChoice("Pay 5 gold coins", () => {
        if (player.gold >= 5) { 
            player.gold -= 5; 
            updateUI(); market(); 
        } else { writeLog("Pockets are too light."); }
    });
    
    addChoice("Slink through the sewers (-25 HP)", () => {
        player.health -= 25; 
        updateUI();
        if (player.health <= 0) return gameOver("The toxic fumes took your life.");
        writeStory("You emerge inside the walls covered in filth and shivering.");
        market();
    });
    
    if (player.reputation >= 10) {
        addChoice("Reason with the Captain", () => {
            writeStory("'I heard of your bravery in the square,' he says. 'Keep your gold.'");
            market();
        });
    }
}

function market() {
    clearChoices();
    writeStory("<b>Chapter 3: The Gilded Market</b>");
    writeStory("A blacksmith and an alchemist offer their wares before your journey into the woods.");
    
    if (!player.inventory.includes("Steel Sword")) {
        addChoice("Purchase Steel Sword (10 Gold)", (btn) => {
            if (player.gold >= 10) {
                player.gold -= 10; player.inventory.push("Steel Sword");
                updateUI(); btn.disabled = true; btn.innerText = "Sword Equipped";
            }
        });
    }
    
    addChoice("Drink Healing Elixir (5 Gold)", (btn) => {
        if (player.gold >= 5) {
            player.gold -= 5; player.health = 100;
            updateUI(); btn.disabled = true; btn.innerText = "Health Restored";
        }
    });
    
    addChoice("Depart for the Whispering Woods", forest);
}

function forest() {
    clearChoices();
    writeStory("<b>Chapter 4: The Whispering Woods</b>");
    writeStory("A Shadow Stalker materializes from the mist, blocking your path.");
    
    if (player.hasMap) {
        addChoice("Consult the Traveler's Map", () => {
            writeLog("Evaded the beast using the map.");
            mountainPass();
        });
    }
    
    addChoice("Engage the Shadow Stalker", () => {
        if (player.inventory.includes("Steel Sword")) {
            player.gold += 25; 
            writeStory("Your steel carves through the smoke. You find gold in its wake.");
            updateUI(); mountainPass();
        } else {
            player.health -= 60; updateUI();
            if (player.health <= 0) return gameOver("The Stalker's claws found your heart.");
            writeStory("You escaped, but you are badly wounded.");
            mountainPass();
        }
    });
}

function mountainPass() {
    clearChoices();
    writeStory("<b>Chapter 5: The Ascent of Sorrows</b>");
    addChoice("Kindle a fire and rest (+15 HP)", (btn) => {
        player.health = Math.min(100, player.health + 15);
        updateUI(); btn.disabled = true;
    });
    addChoice("Push to the summit", mountain);
}

function mountain() {
    clearChoices();
    writeStory("<b>Chapter 6: The Hoard</b>");
    writeStory("You stand before a mountain of gold and the pulsing <b>Dragon Soul Gem</b>.");
    
    addChoice("Fill packs with gold (+150 Gold)", () => { 
        player.gold += 150; player.reputation -= 15; 
        updateUI(); dragonEncounter(); 
    });
    addChoice("Claim the Magic Gem", () => { 
        player.inventory.push("Dragon Soul Gem"); 
        dragonEncounter(); 
    });
    addChoice("Leave it untouched", () => { 
        player.reputation += 100; updateUI(); 
        dragonEncounter(); 
    });
}

function dragonEncounter() {
    clearChoices();
    if (player.reputation >= 100) {
        writeStory("The Frost Dragon respects your restraint and lets you pass.");
        ending();
    } else {
        writeStory("The Dragon awakes with a roar! 'Thief!'");
        addChoice("Fight!", dragonBattle);
    }
}

function dragonBattle() {
    clearChoices();
    if (player.health <= 0) return gameOver("The dragon shattered your body.");
    if (dragonHP <= 0) return ending();

    writeStory(`Dragon: ${dragonHP} HP | Your HP: ${player.health}`);

    if (player.inventory.includes("Steel Sword")) {
        addChoice("Sword Thrust", () => {
            let dmg = 25; dragonHP -= dmg;
            writeStory(`You deal ${dmg} damage.`);
            dragonCounterAttack();
        });
    }

    if (player.inventory.includes("Dragon Soul Gem")) {
        addChoice("Unleash the Gem", () => {
            dragonHP -= 60;
            writeStory("The gem blasts the dragon for 60 damage!");
            dragonCounterAttack();
        });
    }

    addChoice("Defend", () => dragonCounterAttack(true));
}

function dragonCounterAttack(isDefending = false) {
    let dDmg = isDefending ? 5 : 20;
    player.health -= dDmg;
    updateUI();
    if (player.health > 0) addChoice("Continue Fight", dragonBattle);
    else gameOver("The frost consumed you.");
}

function ending() {
    clearChoices();
    let msg = player.reputation >= 100 ? "You are a legend of honor." : "You are rich but haunted.";
    writeStory(msg);
    addChoice("Play Again", startGame);
}

// Launch Game
startGame();