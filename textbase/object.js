let player = { name: "Hero", health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false, day: 1 };
let dragonHP = 150;

const textEl = document.getElementById('game-text');
const choiceEl = document.getElementById('choices');
const logEl = document.getElementById('system-log');
const hpEl = document.getElementById('hp');
const goldEl = document.getElementById('gold');
const repEl = document.getElementById('rep');
const overlayEl = document.getElementById('chapter-overlay');
const titleTextEl = document.getElementById('chapter-title-text');

function updateUI() {
    hpEl.innerText = player.health;
    goldEl.innerText = player.gold;
    repEl.innerText = player.reputation;
}

function showChapter(title) {
    titleTextEl.innerText = title;
    overlayEl.classList.remove('chapter-hidden');
    setTimeout(() => overlayEl.classList.add('chapter-active'), 50);
    setTimeout(() => {
        overlayEl.classList.remove('chapter-active');
        setTimeout(() => overlayEl.classList.add('chapter-hidden'), 800);
    }, 2200);
}

function writeStory(text) {
    const p = document.createElement('p');
    p.innerHTML = text;
    p.classList.add('new-story-line');
    textEl.appendChild(p);
    textEl.scrollTo({ top: textEl.scrollHeight, behavior: 'smooth' });
}

function writeLog(msg) {
    const entry = document.createElement('div');
    entry.innerText = `> ${msg}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

function clearChoices() { choiceEl.innerHTML = ""; }

function addChoice(text, action) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = () => {
        // Dim all current lines because a choice was made
        const activeEntries = textEl.querySelectorAll('.new-story-line');
        activeEntries.forEach(entry => {
            entry.classList.remove('new-story-line');
            entry.classList.add('old-story-line');
        });

        player.day++;
        action();
    };
    choiceEl.appendChild(btn);
}

// 1. Initial State
function initGame() {
    clearChoices();
    textEl.innerHTML = "<p class='new-story-line' style='text-align:center;'>Welcome to Life in Adventure.<br>Your legend begins with a single step.</p>";
    addChoice("Begin Journey", startGame);
}

// 2. Chapter 1
function startGame() {
    player = { name: "Hero", health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false, day: 1 };
    dragonHP = 150;
    textEl.innerHTML = "";
    logEl.innerHTML = "";
    updateUI();
    
    showChapter("Chapter 1: The Shadows");
    
    writeStory("<b>Chapter 1: The Shadows of Oakhaven</b>");
    writeStory("The sun dips below the jagged horizon, painting the sky in bruises of purple and gold. In the village of North Crest, the evening air turns biting and sharp. As you navigate the narrow, cobblestone alleyways near the town square, a desperate cry for help shatters the silence.");
    writeStory("You round a corner to find three hooded bandits, their rusted daggers glinting in the moonlight. They have cornered an elderly traveler against a crumbling stone wall. The old man clutches a tattered bag to his chest, his hands trembling with fear as the bandits growl demands for his life's savings.");
    
    clearChoices();
    addChoice("Intervene: 'Leave him be!'", () => {
        player.reputation += 10; player.health -= 15; player.hasMap = true;
        player.inventory.push("Old Map");
        writeStory("With a roar of defiance, you throw yourself between the old man and the thieves. The struggle is brief but violent; a jagged blade catches your forearm, drawing blood, but your ferocity startles them. Seeing a town guard's torch flickering in the distance, the bandits curse and vanish into the shadows.");
        writeStory("The traveler breathes a sigh of relief. 'You have the heart of a lion,' he whispers, pressing a yellowed, wax-sealed parchment into your hand. 'This map leads to the Frozen Peak. May it guide you to the fortune you deserve.'");
        writeLog("Saved the traveler. HP -15, Received Old Map.");
        updateUI(); townGate();
    });
    addChoice("Observe from the darkness", () => {
        writeStory("You press your back against the cold brick of a nearby building, holding your breath. You watch in silence as the bandits roughly shove the old man to the ground, snatching his bag and disappearing into the night. You remain physically unharmed, but the old man's muffled sobs linger in your ears, a heavy weight settling in your chest.");
        writeLog("Chose the path of caution.");
        townGate();
    });
    addChoice("Join the bandits", () => {
        player.reputation -= 20; player.gold += 15;
        writeStory("Deciding that gold is worth more than a clear conscience, you step into the light with a predatory grin. The bandits are surprised, but they welcome your help in shaking down the traveler. After stripping the man of his coins, they toss you a small pouch as your cut.");
        writeLog("Aided the thieves. Gold +15, Rep -20.");
        updateUI(); townGate();
    });
}

// 3. Chapter 2
function townGate() {
    clearChoices();
    showChapter("Chapter 2: The Iron Gate");
    writeStory("<b>Chapter 2: The Iron Gate</b>");
    writeStory("You reach the Great Northern Gate, a massive structure of iron-reinforced oak that guards the city's inner sanctum. A captain of the guard stands there, leaning on a spear that has seen many battles. He eyes your dusty clothes and travel-worn boots with deep suspicion.");
    writeStory("'The city is under high alert,' he grunts, spitting on the ground. 'Nobody enters without paying the toll. Five gold coins, or you can find somewhere else to sleep tonight. No exceptions.'");
    
    addChoice("Hand over 5 gold", () => {
        if (player.gold >= 5) {
            player.gold -= 5; updateUI();
            writeStory("You count out five glinting coins and drop them into the guard's outstretched palm. He bites one to check its purity, then signals his men to winch the heavy gate open.");
            market();
        } else { writeLog("Pockets are too light."); }
    });

    addChoice("Slink through the sewers (-25 HP)", () => {
        player.health -= 25; updateUI();
        if (player.health <= 0) return gameOver("The toxic fumes of the under-city took your life.");
        writeStory("Refusing to waste your coin, you find a rusted iron grate leading to the city's underbelly. The smell is an assault on your senses. You spend hours wading through filth, eventually emerging from a manhole inside the city walls.");
        market();
    });

    if (player.reputation >= 10) {
        addChoice("Reason with the Captain", () => {
            writeStory("The guard captain pauses, squinting at your face. 'Wait... I know that look. Word reached us that you stood up to those cowards in the square earlier. Keep your gold, traveler. Welcome to the city.'");
            market();
        });
    }
}

// 4. Chapter 3
function market() {
    clearChoices();
    showChapter("Chapter 3: The Market");
    writeStory("<b>Chapter 3: The Gilded Market</b>");
    writeStory("The interior of the city is a whirlwind of color and sound. You find yourself in 'The Adventurer's Rest,' a corner of the market where the air smells of coal smoke and alchemical herbs.");
    
    if (!player.inventory.includes("Steel Sword")) {
        addChoice("Purchase Steel Sword (10 Gold)", () => {
            if (player.gold >= 10) {
                player.gold -= 10; player.inventory.push("Steel Sword");
                updateUI(); writeStory("The blacksmith hands you a blade of fine Oakhaven steel.");
                market(); 
            } else { writeLog("Not enough gold."); }
        });
    }

    addChoice("Drink Healing Elixir (5 Gold)", () => {
        if (player.gold >= 5) {
            player.gold -= 5; player.health = 100;
            writeStory("You purchase a vial of 'Crimson Essence.' Your wounds knit shut instantly.");
            updateUI(); market();
        } else { writeLog("Not enough gold."); }
    });

    addChoice("Depart for the Woods", forest);
}

// 5. Chapter 4
function forest() {
    clearChoices();
    showChapter("Chapter 4: Whispering Woods");
    writeStory("<b>Chapter 4: The Whispering Woods</b>");
    writeStory("A Shadow Stalker—a beast made of living darkness—materializes from the mist.");
    
    if (player.hasMap) {
        addChoice("Consult the Traveler's Map", () => {
            writeStory("You follow a hidden hunter's path marked on the map, bypassing the beast.");
            mountainPass();
        });
    }
    addChoice("Engage the Shadow Stalker", () => {
        if (player.inventory.includes("Steel Sword")) {
            writeStory("You slay the monster with your steel blade.");
            mountainPass();
        } else {
            player.health -= 60; updateUI();
            if (player.health <= 0) return gameOver("The Shadow Stalker claimed your life.");
            writeStory("You barely escape with your life, heavily wounded.");
            mountainPass();
        }
    });
}

function mountainPass() {
    clearChoices();
    writeStory("<b>Chapter 5: The Cold Mountain</b>");
    writeStory("You are climbing up a very high mountain now. There is snow on the ground and the wind is blowing very hard. You find a small cave where you can hide from the cold wind for a little while.");
    
    addChoice("Rest and light a fire", (btn) => {
        player.health = Math.min(100, player.health + 15);
        writeStory("You find some wood and light a small fire. The warm air makes you feel better and your health goes up. After you rest, the fire goes out and the cave gets cold again.");
        writeLog("HP +15. Fire went out.");
        updateUI(); btn.disabled = true; btn.innerText = "Fire is Out";
    });

    addChoice("Keep climbing up", mountain);
}

// 6. Chapter 5 & Dragon
function mountainPass() {
    clearChoices();
    showChapter("Chapter 6: Frozen Peak");
    writeStory("<b>Chapter 5: The Ascent of Sorrows</b>");
    writeStory("You reach the summit. At the center of a hoard rests the **Dragon Soul Gem**.");

    addChoice("Fill packs with gold", () => { player.gold += 150; player.reputation -= 15; dragonEncounter(); });
    addChoice("Claim the Magic Gem", () => { player.inventory.push("Dragon Soul Gem"); dragonEncounter(); });
    addChoice("Leave the hoard untouched", () => { player.reputation += 100; dragonEncounter(); });
}

function dragonEncounter() {
    clearChoices();
    dragonHP = 150;
    if (player.reputation >= 100) {
        writeStory("The Frost Dragon realizes you took nothing. 'One who seeks not for self is worthy.'");
        addChoice("Speak with the Ancient One", ending);
    } else {
        writeStory("The Dragon bellows: 'Thief!'");
        addChoice("Fight!", dragonBattle);
    }
}

function dragonBattle() {
    clearChoices();
    updateUI();
    if (player.health <= 0) return gameOver("The dragon shattered your body.");
    if (dragonHP <= 0) return ending();
    writeStory(`Dragon HP: ${dragonHP} | Your HP: ${player.health}`);
    if (player.inventory.includes("Steel Sword")) {
        addChoice("Thrust with Steel Sword", () => { dragonHP -= 25; writeStory("You strike deep."); dragonCounterAttack(); });
    }
    addChoice("Brace for Impact", () => dragonCounterAttack(true));
}

function dragonCounterAttack(isDefending = false) {
    let dDmg = isDefending ? 5 : 20;
    player.health -= dDmg;
    writeStory(`The dragon sweeps its tail! You take ${dDmg} damage.`);
    updateUI();
    if (player.health > 0) addChoice("Continue Fight", dragonBattle);
    else gameOver("You were turned to ice.");
}

// Endings
function ending() {
    clearChoices();
    showChapter("The Legend Ends");
    writeStory("<b>The Long Road Home</b>");
    let msg = player.reputation >= 100 ? "You returned as a sage." : "You returned home wealthy but haunted.";
    writeStory(msg);
    addChoice("Begin a New Legend", startGame);
}

function gameOver(reason) {
    clearChoices();
    updateUI();
    textEl.innerHTML = ""; 
    writeStory("<h1 style='color: #8b0000; text-align: center;'>GAME OVER</h1>");
    writeStory(`<p style='text-align: center;'>${reason}</p>`);
    addChoice("Begin a New Legend", startGame);
}

initGame();