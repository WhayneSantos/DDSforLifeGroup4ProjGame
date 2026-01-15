let player = { health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false };
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
    void overlayEl.offsetWidth; 
    overlayEl.classList.add('chapter-active');
    setTimeout(() => {
        overlayEl.classList.remove('chapter-active');
        setTimeout(() => overlayEl.classList.add('chapter-hidden'), 800);
    }, 2500);
}

function writeStory(text) {
    const p = document.createElement('p');
    p.innerHTML = text;
    p.classList.add('new-story-line');
    textEl.appendChild(p);
    textEl.scrollTop = textEl.scrollHeight;
}

function writeLog(msg, type = "info") {
    const entry = document.createElement('div');
    entry.className = type === "gain" ? "log-gain" : type === "loss" ? "log-loss" : type === "warn" ? "log-warn" : "";
    entry.innerText = `> ${msg}`; // Fixed syntax: Added backticks and removed lone '>'
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

function clearChoices() { choiceEl.innerHTML = ""; }

function addContinue(nextSceneFunction) {
    clearChoices();
    const btn = document.createElement('button');
    btn.innerText = "Continue Journey...";
    btn.onclick = () => {
        const allLines = textEl.querySelectorAll('.new-story-line');
        allLines.forEach(line => line.classList.replace('new-story-line', 'old-story-line'));
        clearChoices();
        nextSceneFunction();
    };
    choiceEl.appendChild(btn);
}

function addChoice(text, action) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = () => {
        const allLines = textEl.querySelectorAll('.new-story-line');
        allLines.forEach(line => line.classList.replace('new-story-line', 'old-story-line'));
        clearChoices();
        action();
    };
    choiceEl.appendChild(btn);
}

// --- STORY FLOW ---

function initGame() {
    textEl.innerHTML = "";
    logEl.innerHTML = "";
    writeStory("<p style='text-align:center;'>Welcome to Life in Adventure.<br>Your legend begins with a single step.</p>");
    addChoice("Begin Journey", startGame);
}

function startGame() {
    player = { health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false };
    dragonHP = 150;
    updateUI();
    showChapter("Chapter I: Shadows");
    
    writeStory("<b>Chapter 1: The Shadows of Oakhaven</b>");
    writeStory("The sun dips below the jagged horizon, painting the sky in bruises of purple and gold. In the village of North Crest, the evening air turns biting and sharp. As you navigate the narrow, cobblestone alleyways near the town square, a desperate cry for help shatters the silence.");
    writeStory("You round a corner to find three hooded bandits, their rusted daggers glinting in the moonlight. They have cornered an elderly traveler against a crumbling stone wall. The old man clutches a tattered bag to his chest, his hands trembling with fear.");
    
    addChoice("Intervene: 'Leave him be!'", () => {
        player.reputation += 40; player.health -= 15; player.hasMap = true;
        player.inventory.push("Old Map");
        writeLog("Reputation increased", "gain");
        writeLog("Gained: Old Map", "gain");
        writeLog("HP lost in struggle", "loss");
        writeStory("With a roar of defiance, you throw yourself between the old man and the thieves. The struggle is brief but violent; a jagged blade catches your forearm, drawing blood, but your ferocity startles them. They vanish into the shadows.");
        writeStory("The traveler breathes a sigh of relief. 'You have the heart of a lion,' he whispers, handing you a wax-sealed parchment. 'This map leads to the Frozen Peak.'");
        updateUI(); addContinue(townGate);
    });

    addChoice("Observe from the darkness", () => {
        writeLog("Stayed in the shadows.");
        writeStory("You press your back against the cold brick, holding your breath. You watch in silence as the bandits roughly shove the old man to the ground, snatching his bag. You remain unharmed, but his muffled sobs linger in your ears.");
        addContinue(townGate);
    });

    addChoice("Opportunist: Help the thugs.", () => {
        player.reputation -= 20; player.gold += 15;
        writeLog("Gained 15 Gold", "gain");
        writeLog("Reputation decreased", "loss");
        writeStory("Deciding that gold is worth more than a clear conscience, you step into the light with a predatory grin. The bandits are surprised, but they welcome your help. After stripping the man of his coins, they toss you a pouch as your cut.");
        updateUI(); addContinue(townGate);
    });
}

function townGate() {
    showChapter("Chapter II: The Iron Gate");
    writeStory("<b>Chapter 2: The Iron Gate</b>");
    writeStory("You reach the Great Northern Gate, a massive structure of iron-reinforced oak. A captain of the guard stands there, leaning on a spear.");
    writeStory("'The city is under high alert,' he grunts. 'Nobody enters without paying the toll. Five gold coins, or you find somewhere else to sleep.'");
    
    addChoice("Hand over 5 gold", () => {
        if (player.gold >= 5) {
            player.gold -= 5; updateUI();
            writeLog("Paid 5 Gold", "loss");
            writeStory("You count out five glinting coins. He signals his men to winch the heavy gate open.");
            addContinue(market);
        } else { writeLog("Pockets are too light.", "warn"); townGate(); }
    });

    addChoice("Slink through the sewers (-25 HP)", () => {
        player.health -= 50; updateUI();
        writeLog("Took sewer damage", "loss");
        if (player.health <= 0) return gameOver("The toxic fumes of the under-city took your life.");
        writeStory("You find a rusted grate. The smell is an assault on your senses, but you emerge inside the city walls hours later. It almost took your life.");
        addContinue(market);
    });

    if (player.reputation >= 10) {
        addChoice("Renown: 'I helped a traveler earlier.'", () => {
            writeLog("Used Reputation to pass", "gain");
            writeStory("The guard captain pauses. 'Wait... Word reached us that you stood up to those cowards in the square. Keep your gold, traveler. Welcome to the city.'");
            addContinue(market);
        });
    }
}

function market() {
    showChapter("Chapter III: Market");
    setTimeout(marketShop, 500);
}

function marketShop() {
    clearChoices();
    writeStory("<b>The Gilded Market</b>");
    writeStory("The city is a whirlwind of color. You find yourself in 'The Adventurer's Rest,' where the air smells of coal smoke and alchemical herbs.");

    if (!player.inventory.includes("Steel Sword") && !player.inventory.includes("Rusty Sword")) {
        writeStory("A burly blacksmith eyes your empty belt. 'Heading North? 10 gold for Oakhaven Steel, or take this <b>Rusty Sword</b> for free—it's scrap anyway.'");
        
        addChoice("Purchase Steel Sword (10 Gold)", () => {
            if (player.gold >= 10) {
                player.gold -= 10; player.inventory.push("Steel Sword");
                writeLog("Gained: Steel Sword", "gain");
                updateUI(); writeStory("The blacksmith hands you a blade of fine Oakhaven steel.");
                addContinue(marketShop);
            } else { writeLog("Not enough gold.", "warn"); marketShop(); }
        });

        addChoice("Take Rusty Sword (Free)", () => {
            player.inventory.push("Rusty Sword");
            writeLog("Gained: Rusty Sword", "gain");
            writeStory("You pick up the notched, orange blade. It looks brittle, but it's better than nothing.");
            addContinue(marketShop);
        });
    }

    addChoice("Drink Healing Elixir (5 Gold)", () => {
        if (player.gold >= 5) {
            player.gold -= 5; player.health = 100; updateUI();
            writeLog("Health fully restored", "gain");
            writeStory("You purchase 'Crimson Essence.' Your wounds knit shut instantly.");
            addContinue(marketShop);
        } else { writeLog("No coin for elixir!", "warn"); marketShop(); }
    });

    addChoice("Depart for the Woods", () => {
        if (!player.inventory.includes("Steel Sword") && !player.inventory.includes("Rusty Sword")) {
            writeStory("<span style='color: #ffca28;'>Warning: 'You are unarmed are you on a suicide mission?</span> keep the <b>Rusty Sword</b> for your own sake.'");
            addChoice("Go anyway (Bare Hands)", () => {
                writeLog("Entered woods unarmed!", "warn");
                addContinue(sorcererEncounter);
            });
            addChoice("Stay and shop", marketShop);
        } else { addContinue(sorcererEncounter); }
    });
}

function sorcererEncounter() {
    if (!player.atSorcerer) { 
        showChapter("The Mist Sorcerer"); 
        player.atSorcerer = true; 
    }

    clearChoices();
    writeStory("<b>The Sorcerer of the Mist</b>");
    writeStory("As you navigate the thickening fog, a hut built from giant mushrooms and ancient timber appears. An old man in tattered robes sits by a cauldron, the steam smelling of ozone and ancient earth.");
    writeStory("'A traveler seeks the Peak?' he cackles, his eyes glowing with a faint violet light. 'Your blade looks... dull. Power has many prices. I can weave the mists into your steel for <b>10 Gold</b>, or if your name carries enough weight, I will take <b>15 Reputation</b> as payment.'");

    const hasUpgraded = player.inventory.includes("Steel Sword +1") || player.inventory.includes("Reforged Blade");

    if (hasUpgraded) {
        writeStory("<i style='color: #82aaff;'>The old man reaches out to touch your blade, then draws back his hand. 'This steel already sings with my magic, traveler. I cannot layer mists upon a storm.'</i>");
        
        addChoice("Ignore him and move on", () => {
            player.atSorcerer = false; 
            writeLog("Left the hut behind.");
            forest();
        });
    } else {
        addChoice("Enhance with Gold (10G)", () => {
            if (player.gold >= 10) {
                if (applyUpgrade()) { 
                    player.gold -= 10;
                    writeLog("Paid 10 Gold", "loss");
                    updateUI();
                    addContinue(forest);
                }
            } else {
                writeLog("Not enough gold!", "warn");
                sorcererEncounter();
            }
        });

        addChoice("Enhance with Renown (15 Rep)", () => {
            if (player.reputation >= 15) {
                if (applyUpgrade()) {
                    player.reputation -= 15;
                    writeLog("Sacrificed 15 Reputation", "loss");
                    updateUI();
                    addContinue(forest);
                }
            } else {
                writeLog("Your name is not yet a legend!", "warn");
                sorcererEncounter();
            }
        });

        addChoice("Ignore the Sorcerer", () => {
            player.atSorcerer = false; 
            writeLog("Left the hut behind.");
            forest();
        });
    }
}

function applyUpgrade() {
    if (player.inventory.includes("Steel Sword")) {
        player.inventory = player.inventory.filter(i => i !== "Steel Sword");
        player.inventory.push("Steel Sword +1");
        writeLog("Upgraded: Steel Sword +1", "gain");
        writeStory("He dips your blade into the brew. It emerges shimmering with a cold blue light. You feel its power hum in your palm.");
        return true;
    } else if (player.inventory.includes("Rusty Sword")) {
        player.inventory = player.inventory.filter(i => i !== "Rusty Sword");
        player.inventory.push("Reforged Blade");
        writeLog("Upgraded: Reforged Blade", "gain");
        writeStory("The sorcerer scrapes away the rust with a wave of his hand. The orange flakes turn into sharp, jagged steel that glints dangerously.");
        return true;
    } else {
        writeLog("Upgrade Failed: Unarmed", "warn");
        writeStory("'I cannot enchant your bare skin, fool!' the sorcerer laughs, stirring his cauldron. 'Go find a real tool.'");
        addContinue(forest);
        return false;
    }
}

function forest() {
    showChapter("Chapter IV: The Woods");
    writeStory("<b>Chapter 4: The Whispering Woods</b>");
    
    // Practice Stage logic starts here
    writeStory("The fog thickens. Suddenly, a <b>Mist Panther</b> stalks out from the brush. Its muscles coil—it is preparing to strike!");
    writeStory("<small style='color: #82aaff;'><i>Practice Tip: Watch the enemy's intent. When an enemy 'coils' or 'charges,' it is usually better to Dodge than to Attack.</i></small>");
    
    player.forestTurn = 0; // Initialize practice turn counter
    forestPracticeCombat();
}

function forestPracticeCombat() {
    clearChoices();
    player.forestTurn++;
    
    let pantherAction = "";
    let isPouncing = (player.forestTurn % 2 === 0);

    if (isPouncing) {
        pantherAction = "<b style='color:#ff5555'>The panther is mid-air, pouncing at your throat!</b>";
    } else {
        pantherAction = "The panther circles you, hissing low.";
    }

    writeStory(`<b>[PRACTICE TURN ${player.forestTurn}]</b><br>${pantherAction}`);

    // CHOICE 1: Attack (Practice for All-Out Attack)
    addChoice("Strike with Weapon", () => {
        let dmg = player.inventory.length > 0 ? 25 : 5;
        let penalty = isPouncing ? 20 : 5; // Higher damage taken if you attack while he pounces
        
        player.health -= penalty;
        writeStory(`You strike the panther for ${dmg} DMG, but it claws you for ${penalty} DMG.`);
        writeLog(`Took ${penalty} DMG`, "loss");
        
        checkForestVictory(dmg);
    });

    // CHOICE 2: Dodge (Practice for Dodge and Counter)
    addChoice("Dodge and Counter", () => {
        let penalty = isPouncing ? 0 : 5; // Perfect dodge if he was pouncing
        let counterDmg = 15;
        
        player.health -= penalty;
        writeStory(isPouncing 
            ? "<b>Perfect!</b> You roll under the pounce and slash its belly." 
            : "You dodge its swipe and land a quick hit.");
        
        writeLog(isPouncing ? "Perfect Dodge!" : "Took 5 DMG", isPouncing ? "gain" : "loss");
        
        checkForestVictory(counterDmg);
    });
}

function checkForestVictory(dmg) {
    updateUI();
    if (player.health <= 0) return gameOver("The Mist Panther was too much for you.");
    
    // After 2 successful hits, the player wins the practice
    if (!player.practiceHits) player.practiceHits = 0;
    player.practiceHits += dmg;

    if (player.practiceHits >= 30) {
        writeStory("The panther retreats, wounded. You feel more prepared for the dangers ahead.");
        player.practiceHits = 0; // Reset for future runs
        addContinue(forestPostCombat);
    } else {
        addContinue(forestPracticeCombat);
    }
}

function forestPostCombat() {
    writeStory("With the beast gone, you look at your surroundings.");
    
    if (player.hasMap) {
        addChoice("Consult the Traveler's Map", () => {
            writeLog("Used map to navigate", "gain");
            writeStory("The map reveals a hidden tunnel beneath the roots, bypassing the Shadow Stalker entirely.");
            addContinue(mountainPass);
        });
    }

    addChoice("Engage the Shadow Stalker", () => {
        if (player.inventory.length > 0) {
            writeLog("Defeated Shadow Stalker", "gain");
            writeStory("Drawing on your recent practice, you easily dispatch the Stalker.");
            addContinue(mountainPass);
        } else {
            player.health -= 40; // Reduced damage since they practiced!
            updateUI();
            writeLog("Wounded by Stalker", "loss");
            if (player.health <= 0) return gameOver("The Shadow Stalker claimed your life.");
            writeStory("You barely escape with your life.");
            addContinue(mountainPass);
        }
    });
}

function mountainPass() {
    showChapter("Chapter V: The Peak");
    writeStory("<b>Chapter 5: The Cold Mountain</b>");
    writeStory("You are climbing up a very high mountain now. There is snow on the ground and the wind is blowing very hard. You find a small cave.");
    
    addChoice("Rest and light a fire", () => {
        player.health = Math.min(100, player.health + 15);
        writeLog("Rested by fire (+15 HP)", "gain");
        writeStory("The warm air makes you feel better. HP +15.");
        updateUI(); addContinue(frozenPeak);
    });
    addChoice("Keep climbing up", () => {
        writeLog("Pushed through the cold.");
        addContinue(frozenPeak);
    });
}

function frozenPeak() {
    showChapter("Chapter VI: The Gem");
    writeStory("<b>Chapter 6: The Ascent of Sorrows</b>");
    writeStory("You reach the summit. At the center of a hoard rests the *Dragon Soul Gem*, pulsing with power.");

    addChoice("Fill packs with gold", () => { 
        player.gold += 150; player.reputation -= 15; updateUI(); 
        writeLog("Stole Dragon Gold (+150)", "gain");
        writeLog("Reputation loss for theft", "loss");
        writeStory("You greedily stuff your bags with gold coins. The clinking of metal echoes through the cavern.");
        addContinue(dragonEncounter); 
    });
    addChoice("Claim the Magic Gem", () => { 
        player.inventory.push("Dragon Soul Gem"); 
        writeLog("Took Dragon Soul Gem", "gain");
        writeStory("You lift the Gem. It feels warm, vibrating with a life of its own.");
        addContinue(dragonEncounter); 
    });
    addChoice("Leave the hoard untouched", () => { 
        player.reputation += 100; updateUI(); 
        writeLog("Showed pure honor", "gain");
        writeStory("You show respect to the ancient site, taking nothing but the view.");
        addContinue(ending); 
    });
}

function dragonBattle() {
    if (player.health <= 0) {
        return gameOver("The Frost Dragon's breath turned your blood to ice. Your journey ends here, frozen in time.");
    }
    if (dragonHP <= 0) {
        writeLog("SLAYED THE FROST DRAGON", "gain");
        writeStory("With one final, desperate thrust, you find a gap in the dragon's armor. The beast lets out a sky-shaking roar before collapsing, its crystalline body shattering into a thousand shimmering shards.");
        return ending();
    }

    dragonTurn++;
    clearChoices();

    let isSpecialAttack = (dragonTurn % 3 === 0);
    let dragonAction = "";
    
    if (isSpecialAttack) {
        dragonAction = "<b style='color:#82aaff'>The dragon is inhaling deeply... Frost is forming around its jaws!</b>";
    } else if (dragonHP < 50) {
        dragonAction = "<b style='color:#ff5555'>The dragon is enraged! It's preparing a massive tail sweep!</b>";
    } else {
        dragonAction = "The dragon looms over you, its claws scraping against the icy stone.";
    }

    writeStory(`<b>[TURN ${dragonTurn}]</b><br>${dragonAction}<br>Dragon HP: ${dragonHP} | Your HP: ${player.health}`);

    addChoice("All-Out Attack", () => {
        let dmg = 5;
        let msg = "You punch the dragon's scales! it barely even notice";
        
        if (player.inventory.includes("Steel Sword +1")) { dmg = 45; msg = "Your enchanted Oakhaven Steel cleaves deep!"; }
        else if (player.inventory.includes("Steel Sword")) { dmg = 30; msg = "Your Steel Sword bites into its hide!"; }
        else if (player.inventory.includes("Reforged Blade")) { dmg = 25; msg = "The reforged blade strikes true!"; }
        else if (player.inventory.includes("Rusty Sword")) {
            if (Math.random() < 0.15) {
                player.inventory = player.inventory.filter(i => i !== "Rusty Sword");
                dmg = 0; msg = "<b style='color:#ff5555'>Your Rusty Sword shatters against the scales!</b>";
            } else { dmg = 15; msg = "The rusty blade scrapes the dragon!"; }
        }

        let taken = isSpecialAttack ? 40 : 20;
        dragonHP -= dmg;
        player.health -= taken;
        
        writeStory(`${msg} (${dmg} DMG)`);
        writeLog(`Dealt ${dmg} DMG`, "gain");
        writeLog(`Took ${taken} DMG`, "loss");
        updateUI();
        dragonBattle();
    });

    addChoice("Dodge and Counter", () => {
        let taken = 0;
        let counterDmg = 10;
        let logMsg = "";

        if (isSpecialAttack) {
            // High dodge chance (80%) during special attack
            if (Math.random() < 0.80) {
                taken = 0;
                logMsg = "Perfect Dodge! 0 DMG taken";
                writeStory("As the dragon unleashes a torrent of frost, you dive behind a jagged rock! The ice misses you completely.");
            } else {
                taken = 15; // Penalty for failing a high-stakes dodge
                logMsg = "Dodge failed! Took 15 DMG";
                writeStory("You try to dive away, but the frost breath catches your cloak!");
            }
        } else {
            // Normal turn dodge (original logic)
            taken = 10;
            logMsg = "Dodged! Only took 10 DMG";
            writeStory("You roll beneath the dragon's strike, delivering a quick counter-blow as you move.");
        }
        
        player.health -= taken;
        dragonHP -= counterDmg;
        
        writeLog(logMsg, taken === 0 ? "gain" : "loss");
        writeLog(`Countered for ${counterDmg} DMG`, "gain");
        updateUI();
        dragonBattle();
    });

    if (player.inventory.includes("Dragon Soul Gem")) {
        addChoice("Use Dragon Soul Gem", () => {
            writeStory("The Gem in your pack pulses with blinding light! It drains the dragon's heat.");
            dragonHP -= 60;
            player.gemUsed = true; 
            player.inventory = player.inventory.filter(i => i !== "Dragon Soul Gem");
            writeLog("Gem unleashed! 60 DMG", "gain");
            updateUI();
            dragonBattle();
        });
    }
}

function ending() {
    clearChoices();
    showChapter("The Legend Ends");
    writeStory("<b>The Long Road Home</b>");
    
    let title = "";
    let epilogue = "";
    let gemNote = "";

    if (player.reputation >= 100) {
        title = "The Sage of the Peak";
        epilogue = "By sparing the hoard and showing mercy, you gained the respect of the ancient world. You returned to Oakhaven not with gold, but with wisdom that healed the fractured village for generations.";
    } 
    else if (player.reputation >= 40) {
        title = "The Hero King";
        epilogue = "With the dragon defeated, you were carried back to the city on the shoulders of the guard. You used your renown to lead Oakhaven into a golden age of peace and prosperity.";
    } 
    else if (player.reputation <= -20) {
        title = "The Wealthy Outcast";
        epilogue = "You returned with heavy bags of dragon gold, but the people look at you with fear and suspicion. You live in a hollow palace, surrounded by riches but haunted by the shadows of those you stepped on.";
    } 
    else {
        title = "The Lone Mercenary";
        epilogue = "The dragon is dead, and your pockets are full enough to live comfortably. You disappeared into the mist shortly after, a wanderer whose name is whispered in taverns but never truly known.";
    }

    if (player.inventory.includes("Dragon Soul Gem")) {
        gemNote = "<br><br><i style='color: #82aaff;'>The Dragon Soul Gem remains in your possession, pulsing with a faint, rhythmic heat. Some say you are waiting for the right moment to sell it, while others whisper that the dragon's spirit is beginning to talk to you in your sleep...</i>";
    } else if (player.gemUsed) {
        gemNote = "<br><br><i style='color: #ffca28;'>The Dragon Soul Gem was shattered during the final conflict, its magic spent to save your life. Though the physical stone is gone, your veins occasionally glow with a soft blue light when you are angry.</i>";
    } else if (player.inventory.includes("Old Map")) {
        gemNote = "<br><br><i>You still carry the old traveler's map, its edges frayed. Perhaps there are other peaks, and other legends, yet to be found.</i>";
    }

    // Fixed Syntax: Backticks added for multi-line/variable string
    writeStory(`The dust of battle settles as you descend the mountain for the final time. ${epilogue}${gemNote}`);
    writeStory(`Your Legend is etched into history as: <b style="color: #a68d60; font-size: 1.2rem;">${title}</b>`);
    
    writeLog("Story Completed.", "gain");
    writeStory(`<small style='opacity:0.6'>Final Stats — Gold: ${player.gold} | Reputation: ${player.reputation}</small>`);
    
    addChoice("Begin a New Legend", initGame);
}

function gameOver(reason) {
    clearChoices();
    writeLog("GAME OVER", "loss");
    
    writeStory(`<div style="text-align:center; padding: 20px;">
        <h2 style='color:#ff5555; letter-spacing: 2px;'>— YOU HAVE PERISHED —</h2>
        <p>${reason}</p>
    </div>`);

    addChoice("Restart Journey", initGame);
}

initGame();

//fix function forest add barehand scene
//add high dodge chance when the dragon do a special attack
//add a twist for the 'observe in the shadow' choice