// --- GAME STATE OBJECTS --- // 

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
const sceneImgEl = document.getElementById('scene-image');

// --- FIXED IMAGE LOGIC --- //

function changeImage(url) {
    if (!sceneImgEl) return;
    sceneImgEl.classList.add('fade-out');
    setTimeout(() => {
        sceneImgEl.src = url;
        sceneImgEl.onload = () => {
            sceneImgEl.classList.remove('fade-out');
        };
        sceneImgEl.onerror = () => {
            sceneImgEl.classList.remove('fade-out');
            console.error("Failed to load image at: " + url);
        };
    }, 500);
}

/**
 * Syncs the current player object values (HP, Gold, Rep) 
 * with the visual numbers shown on the screen.
 */
function updateUI() {
    hpEl.innerText = player.health;
    goldEl.innerText = player.gold;
    repEl.innerText = player.reputation;
}

/**
 * Triggers a temporary "Chapter Title" overlay.
 * It shows the title, waits 2.5 seconds, then fades out.
 */
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

/**
 * Adds a new paragraph of story text to the game window.
 * Automatically scrolls to the bottom so the player sees the newest text.
 */
function writeStory(text) {
    const p = document.createElement('p');
    p.innerHTML = text;
    p.classList.add('new-story-line'); // Used to style the most recent text differently
    textEl.appendChild(p);
    textEl.scrollTop = textEl.scrollHeight; // Auto-scrolls to the bottom
}

/**
 * Adds a technical notification to the side log (e.g., "Item Gained" or "Took Damage").
 * Uses different CSS classes based on the 'type' for color-coding.
 */
function writeLog(msg, type = "info") {
    const logEl = document.getElementById('system-log');
    
    if (!logEl) {
        console.error("Element #system-log not found in HTML");
        return;
    }
    
    const entry = document.createElement('div');
    
    if (type === "gain") entry.className = "log-gain";
    else if (type === "loss") entry.className = "log-loss";
    else if (type === "warn") entry.className = "log-warn";
    else entry.className = "log-info";
    
<<<<<<< HEAD
    entry.innerText = `> ${msg}`;
=======
    entry.innerText = `${msg}`;
>>>>>>> 6b3e739 (added Image)
    
    // 3. Add to the window and scroll
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}
/**
 * Removes all current buttons from the choice container.
 * Usually called before displaying new choices.
 */
function clearChoices() { 
    choiceEl.innerHTML = ""; 

}

/**
 * Creates a single "Continue" button.
 * When clicked, it dims the current text and moves the story to the next function.
 */

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
        action(); // Run the consequence/next scene
    };
    choiceEl.appendChild(btn);
}

// --- STORY FLOW --- //

function initGame() {
    textEl.innerHTML = "";
    logEl.innerHTML = "";
<<<<<<< HEAD
    writeStory("<p style='text-align:center;'>UNWRITTEN ADVENTURE<br>Your legend begins with a single step.</p>");
=======
    writeStory("<p style='text-align:center;'>UNWRITTEN ADVENTURE.<br>Your legend begins with a single step.</p>");
>>>>>>> 6b3e739 (added Image)
    addChoice("Begin Journey", startGame);
}

// --- START GAME ---//

function startGame() {
    player = { health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false };
    dragonHP = 150;
    updateUI();
    changeImage("images/forest.png");
                        showChapter("Chapter I: Shadows");
    
    writeStory("<b>Chapter 1: The Shadows of Oakhaven</b>");
    writeStory("The sun dips below the jagged horizon, painting the sky in bruises of purple and gold. In the village of North Crest, the evening air turns biting and sharp. As you navigate the narrow, cobblestone alleyways near the town square, a desperate cry for help shatters the silence.");
    writeStory("You round a corner to find three hooded bandits, their rusted daggers glinting in the moonlight. They have cornered an elderly traveler against a crumbling stone wall. The old man clutches a tattered bag to his chest, his hands trembling with fear.");

// --- CHOICE BRANCHES --- //

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
    writeStory("You press your back against the cold brick, holding your breath. You watch in silence as the bandits roughly shove the old man to the ground, snatching his bag.");


    writeStory("<br>As the bandits turn to flee, the leader stops. He sniffs the air and looks directly at your hiding spot. 'Well, well,' he sneers, 'a witness who likes to watch.'");
    writeStory("They don't attack, but they mock your cowardice. One tosses a heavy, blood-stained coin at your feet. 'A gift for staying quiet, mouse.'");

    player.gold += 5;
    player.reputation -= 10;
    updateUI();

    writeLog("Gained 5 Blood Money", "gain");
    writeLog("Reputation decreased (Cowardice)", "loss");

    writeStory("The bandits vanish. You find a <b>Scrap of Parchment</b> the old man dropped—it’s a piece of the map, but the rest is gone with the thieves.");

    player.hasMap = true;
    player.inventory.push("Tattered Map Piece");

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
    changeImage("images/towngate.png")
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

    addChoice("Slink through the sewers (-30 HP)", () => {
        player.health -= 30; updateUI();
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

// --- MARKET --- //

function market() {
    changeImage("images/gildedmarket.png")
    showChapter("Chapter III: Market");
    setTimeout(marketShop, 500);
}

function marketShop() {
    clearChoices();
    writeStory("<b>The Gilded Market</b>");
    writeStory("The city is a whirlwind of color. You find yourself in 'The Adventurer's Rest,' where the air smells of coal smoke and alchemical herbs.");

    if (!player.inventory.includes("Steel Sword") && !player.inventory.includes("Rusty Sword")) {
        writeStory("A burly blacksmith eyes your empty belt. 'Heading North? 10 gold for Oakhaven Steel, or take this <b>Rusty Sword</b> for free—it's scrap anyway.'");

        // --- CHOICE BRANCHES --- //

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

// --- SORCERER --- //

function sorcererEncounter() {
    if (!player.atSorcerer) { 
        changeImage("images/sorcerer.png")
        showChapter("The Mist Sorcerer"); 
        player.atSorcerer = true; 
    }

// --- CHOICE BRANCHES --- //

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

// --- UPGRADE LOGIC --- //

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

// --- FOREST & PRACTICE COMBAT --- //

function forest() {
    changeImage("images/mistpantherr.png")
    showChapter("Chapter IV: The Woods");
    writeStory("<b>Chapter 4: The Whispering Woods</b>");

    // Practice Stage logic starts here
    writeStory("The mist here doesn't just hang in the air; it breathes. As you navigate the gnarled roots, a section of the fog seems to solidify. The Mist Panther doesn't just step out—it manifests.");
    writeStory("It stands nearly five feet at the shoulder, its body long and serpentine. Unlike a normal feline, its breath comes out as a faint, glowing vapor that smells of wet stone and ozone.");
    writeStory("<small style='color: #82aaff;'><i>Practice Tip: Watch the enemy's intent. When an enemy 'coils' or 'charges,' it is usually better to Dodge than to Attack.</i></small>");

    player.forestTurn = 0; // Initialize practice turn counter
    forestPracticeCombat();
}

// --- CHOICE BRANCHES --- //

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

<<<<<<< HEAD
        writeLog(isPouncing ? "Perfect Dodge!" : "Took 5 DMG", isPouncing ? "gain" : "loss");
=======
        writeLog(isPouncing ? "Perfect Dodge!" : `Took 5 DMG`, isPouncing ? "gain" : "loss");
>>>>>>> 6b3e739 (added Image)

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

// --- MOUNTAIN --- //

function mountainPass() {
    changeImage("images/climbmountain.png")
    showChapter("Chapter V: The Peak");
    writeStory("<b>Chapter 5: The Cold Mountain</b>");
    writeStory("The path behind you has long since vanished, buried under a shifting shroud of white. As you climb, the air thins until every breath feels like swallowing needles. The wind here isn't just a sound; it’s a physical force, a relentless gale that screams through the jagged crags like a dying god.");
    writeStory("Just as the cold begins to seep into the marrow of your bones, the swirling snow parts for a fleeting second. Carved into the face of a sheer obsidian cliff is a jagged opening—a small, low-ceilinged cave.");

// --- CHOICE BRANCHES --- //

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

// --- FROZENPEAK --- //

function frozenPeak() {
    changeImage("images/treasures.png")
    showChapter("Chapter VI: The Legendary Gem");
    writeStory("<b>Chapter 6: The Ascent of Sorrows</b>");
    writeStory("As you crest the final, jagged ridge of the summit, the biting mountain air gives way to a heavy, metallic warmth. Before you lies a sprawling amphitheater of stone, its floor obscured by a vast, undulating sea of wealth.");
    writeStory("Thousands of ancient gold sovereigns, stamped with the faces of forgotten kings, spill across the cavern floor like a frozen sunset. Tangled within this ocean of coin are emerald-encrusted chalices, silver-threaded tapestries, and masterwork blades that have long since surrendered their sharpness to the passage of time.");
    writeStory("At the epicenter of this glittering ruin, resting atop a mountain of gold, lies the <h2 style='color:#ff5555;'> Dragon Soul Gem.</h2>");

// --- CHOICE BRANCHES --- //

    addChoice("Fill packs with ancient gold", () => { 
        player.gold += 150; 
        player.reputation -= 15; 
        updateUI(); 
        writeLog("Stole Dragon Gold (+150)", "gain");
        writeStory("In a final, pivotal moment of clarity, you realize the Dragon Soul Gem is a trap—a vessel for an ancient hunger that would eventually hollow out your soul. You loosen your grip, letting the pulsing obsidian stone fall. It clatters insignificantly against the stone, its violet fire dimming as it loses its connection to a living host.");
        writeStory("Instead, you turn your gaze toward the staggering reality of the hoard itself. You choose the Ancient Gold and Coins, the tangible legacy of a thousand years of history, over the parasitic magic of the gem.");
        dragonEncounter();
    });

    addChoice("Claim the Dragon Soul Gem", () => { 
        player.inventory.push("Dragon Soul Gem"); 
        writeLog("Took Dragon Soul Gem", "gain");
        writeStory("As your fingers close around the cold, multifaceted surface of the Dragon Soul Gem, the world around you suddenly fractures. The transition is violent and instantaneous, shifting from the physical reality of the mountain to a psychic overload of pure, draconic power.");

        setTimeout(() => {
            dragonEncounter(); 
        }, 100);
    });

    addChoice("Leave the hoard untouched", () => { 
        player.reputation += 100; 
        updateUI(); 
        writeLog("Showed pure honor", "gain");
        writeStory("You stand at the summit, the most powerful artifact in existence clutched in your hand, yet you leave the mountain of wealth behind. The gold lies scattered and broken—lifeless yellow metal once stripped of its magical allure.");
        writeStory("The wind howls across the peak, already beginning to bury the untouched coins in a fine layer of snow and frost. The hoard remains, vast and cold, a tomb for a king you refused to become.");
        addContinue(ending); 
    });
}

let dragonTurn = 0;

// --- DRAGON ENCOUNTER --- //

function dragonEncounter() {
    changeImage("images/dragonencounter.png");
    dragonTurn = 0;
    clearChoices();
    writeLog("The Dragon has appeared!", "warn");
    writeStory("The cavern floor doesn't just tremble; it heaves. As you reach for the scattered riches, a mountain of silver-frosted scales shifts beneath the gold. With a sound like a glacier splintering, the Frost Dragon uncoils, rising from the hoard like a nightmare made of diamond and spite.");

setTimeout(() => { //animation
        addContinue(dragonBattle);
    }, 50);
}

// --- DRAGON BATTLE --- //

function dragonBattle() {
    changeImage("images/dragonfight.png");
    if (player.health <= 0) {
        return gameOver("The summit, once a place of gleaming promise, becomes your altar of sacrifice. You fought with the desperation of a mortal defying a god, but the Frost Dragon is not merely a beast—it is the winter’s fury given flesh and scale. Your journey ends here, frozen in time.");
    }
    if (dragonHP <= 0) {
        writeLog("SLAYED THE FROST DRAGON", "gain");
        writeStory("With one final, desperate thrust, you find a gap in the dragon's armor. The beast lets out a sky-shaking roar before collapsing, its crystalline body shattering into a thousand shimmering shards.");
        return ending();
    }

// --- DRAGON SPECIAL ATTACK --- //

    dragonTurn++;
    clearChoices();

    let isSpecialAttack = (dragonTurn % 3 === 0);
    let dragonAction = "";

    if (isSpecialAttack) {
        dragonAction = "<b style='color:#82aaff'>The dragon is inhaling deeply... Frost is forming around its jaws!</b>";
        changeImage("Images/dragonWhileSpe1.png");
    } else if (dragonHP < 50) {
        dragonAction = "<b style='color:#ff5555'>The dragon is enraged! It's preparing a massive tail sweep!</b>";
    } else {
        dragonAction = "The dragon looms over you, its claws scraping against the icy stone.";
    }

    // --- player attack branches --- //

    writeStory(`<b>[TURN ${dragonTurn}]</b><br>${dragonAction}<br>Dragon HP: ${dragonHP} | Your HP: ${player.health}`);

    addChoice("All-Out Attack", () => {
        let dmg = 5;
        let msg = "You punch the dragon's scales! it barely even notice"; /* if the player has no sword*/

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

    // --- Dodge and Counter Branch --- //

    addChoice("Dodge and Counter", () => {
        let taken = 0;
        let counterDmg = 10;
        let logMsg = "";

        if (isSpecialAttack) {
            // High dodge chance (80%) during special attack
            if (Math.random() < 0.80) {
                taken = 0;
                logMsg = "Perfect Dodge! 0 DMG taken";
                changeImage("Images/dragonDoSpe1.png");
                writeStory("As the dragon unleashes a torrent of frost, you dive behind a jagged rock! The ice misses you completely.");
                changeImage("Images/dragonDoSpe1.png");
            } else {
                changeImage("Images/dragonDoSpe1.png");
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

    // --- Use Gem Branch --- //

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

// --- ENDING & GAME OVER --- //

function ending() {
    clearChoices();
    changeImage("Images/dragondefeated.png"); /* no image yet */
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
    else if (player.gold >= 150) {
        title = "The Wealthy Outcast";
        epilogue = "You returned with heavy bags of dragon gold, but the people look at you with fear and suspicion. You live in a hollow palace, surrounded by riches but haunted by the shadows of those you stepped on.";
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

// --- GAME OVER --- //

function gameOver(reason) {
    clearChoices();
    changeImage("Images/travelerdefeated.png")
    writeLog("GAME OVER", "loss");

    writeStory(`<div style="text-align:center; padding: 20px;">
        <h2 style='color:#ff5555; letter-spacing: 2px;'>— YOU HAVE PERISHED —</h2>
        <p>${reason}</p>
    </div>`);

    addChoice("Restart Journey", initGame);
}

// --- LOBBY & START --- //

function initGame() {
    textEl.innerHTML = "";
    logEl.innerHTML = "";
    clearChoices();

    player = { health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false };
    dragonHP = 150;
    updateUI();
    changeImage("Images/intro.png");

    // The Lobby UI
    writeStory(`
        <div style="text-align:center; padding: 20px; border: 1px solid #444; background: rgba(0,0,0,0.2); border-radius: 8px;">
<<<<<<< HEAD
            <h1 style="color: #a68d60; margin-bottom: 10px; letter-spacing: 3px;">UNWRITTEN ADVENTURE</h1>
=======
            <h1 style="color: #a68d60; margin-bottom: 10px; letter-spacing: 3px;"> ADVENTURE</h1>
>>>>>>> 6b3e739 (added Image)
            <p style="font-style: italic; color: #888;">"Every legend begins with a single choice."</p>
            <hr style="border: 0; border-top: 1px solid #444; margin: 20px 0;">
            <p style="text-align: left; font-size: 0.95rem;">
                Welcome, Traveler. In this realm, your <b>Reputation</b> determines how the world sees you, 
                and your <b>Gold</b> dictates what you can survive. 
                Keep a sharp eye on your <b>HP</b>—the path to the Frozen Peak is treacherous.
            </p>
        </div>
    `);

    addChoice("START NEW ADVENTURE", introCinematic);
}

// --- GAME INTRO --- //

function introCinematic() {
    textEl.innerHTML = "";
    writeStory("The wind howls through the valley of Oakhaven, carrying whispers of a forgotten dragon and a gem that can bend the soul.");
    writeStory("You arrived here with nothing but a few coins and a restless spirit, seeking a name that will outlive your bones.");

    setTimeout(() => {
        addContinue(startGame);
    }, 800);
}

initGame();