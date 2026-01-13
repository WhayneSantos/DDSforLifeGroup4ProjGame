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
    p.style.lineHeight = "1.5";
    p.innerHTML = text;
    textEl.appendChild(p);
    textEl.scrollTop = textEl.scrollHeight;
}

function writeLog(msg) {
    const entry = document.createElement('div');
    entry.className = "log-entry";
    // FIXED: Added backticks and template literal syntax
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

// --- NEW GAME OVER SCREEN ---

function gameOver(reason) {
    clearChoices();
    updateUI();
    textEl.innerHTML = ""; 
    writeStory("<h1 style='color: #e74c3c; text-align: center;'>GAME OVER</h1>");
    // FIXED: Added backticks
    writeStory(`<p style='text-align: center;'>${reason}</p>`);
    writeStory("<hr>");
    writeStory("<b>Your Final Stats:</b>");
    // FIXED: Added backticks
    writeStory(`* Days Survived: ${player.day}`);
    writeStory(`* Gold Collected: ${player.gold}`);
    writeStory(`* Reputation: ${player.reputation}`);
    
    addChoice("Try Again", startGame);
}

// --- GAME SCENES ---

// ... (Keep all your variables and helper functions like updateUI, writeStory, etc. the same) ...

function startGame() {
    player = { name: "Hero", health: 100, gold: 15, reputation: 0, inventory: [], hasMap: false, day: 1 };
    dragonHP = 150;
    updateUI();
    textEl.innerHTML = "";
    logEl.innerHTML = "";
    
    writeStory("<b>Chapter 1: The Shadows of Oakhaven</b>");
    writeStory("The sun dips below the jagged horizon, painting the sky in bruises of purple and gold. In the village of Oakhaven, the evening air turns biting and sharp. As you navigate the narrow, cobblestone alleyways near the town square, a desperate cry for help shatters the silence.");
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
        writeStory("As you walk away, you notice several villagers watching from their windows. Their eyes are filled with fear and disgust. You are richer, but you are no longer welcome in the light of Oakhaven.");
        writeLog("Aided the thieves. Gold +15, Rep -20.");
        updateUI(); townGate();
    });
}

function townGate() {
    clearChoices();
    writeStory("<b>Chapter 2: The Iron Gate</b>");
    writeStory("You reach the Great Southern Gate, a massive structure of iron-reinforced oak that guards the city's inner sanctum. A captain of the guard stands there, leaning on a spear that has seen many battles. He eyes your dusty clothes and travel-worn boots with deep suspicion.");
    writeStory("'The city is under high alert,' he grunts, spitting on the ground. 'Nobody enters without paying the toll. Five gold coins, or you can find somewhere else to sleep tonight. No exceptions.'");
    
    addChoice("Hand over the 5 gold coins", () => {
        if (player.gold >= 5) { 
            player.gold -= 5; 
            writeStory("You count out five glinting coins and drop them into the guard's outstretched palm. He bites one to check its purity, then signals his men to winch the heavy gate open. The gears groan and protest as the way forward is cleared.");
            updateUI(); market(); 
        } else { writeLog("Your pockets are too light for the toll."); }
    });
    
    addChoice("Slink through the sewers (-25 HP)", () => {
        player.health -= 25; 
        updateUI();
        if (player.health <= 0) return gameOver("The toxic fumes of the under-city took your life.");
        writeStory("Refusing to waste your coin, you find a rusted iron grate leading to the city's underbelly. The smell is an assault on your senses—rotting waste and stagnant water. You spend hours wading through knee-deep filth and dodging aggressive rats, eventually emerging from a manhole inside the city walls, covered in grime and shivering from a fever.");
        market();
    });
    
    if (player.reputation >= 10) {
        addChoice("Reason with the Captain", () => {
            writeStory("The guard captain pauses, squinting at your face. 'Wait... I know that look. Word reached us that you stood up to those cowards in the square earlier. We need more folk with steel in their spine around here.' He gestures for his men to stand aside. 'Keep your gold, traveler. Welcome to the city.'");
            market();
        });
    }
}

function market() {
    clearChoices();
    writeStory("<b>Chapter 3: The Gilded Market</b>");
    writeStory("The interior of the city is a whirlwind of color and sound. Merchants shout prices for exotic silks, and the smell of roasting meat wafts through the air. You find yourself in 'The Adventurer's Rest,' a small corner of the market where the air smells of coal smoke and alchemical herbs.");
    writeStory("A grizzled blacksmith hammers away at a glowing anvil, while a hooded woman stirs a cauldron of bubbling red liquid nearby. You know that the journey ahead into the forest will be treacherous; you must decide how to spend your remaining resources.");
    
    if (!player.inventory.includes("Steel Sword")) {
        addChoice("Purchase Steel Sword (10 Gold)", (btn) => {
            if (player.gold >= 10) {
                player.gold -= 10; player.inventory.push("Steel Sword");
                writeStory("The blacksmith hands you a blade of fine Oakhaven steel. It feels perfectly balanced in your hand, the leather grip warm and firm. 'Treat her well,' the smith rumbles, 'and she'll keep your head on your shoulders.'");
                updateUI(); btn.disabled = true; btn.innerText = "Sword Equipped";
            }
        });
    }
    
    addChoice("Drink Healing Elixir (5 Gold)", (btn) => {
        if (player.gold >= 5) {
            player.gold -= 5; player.health = 100;
            writeStory("You purchase a vial of the woman's 'Crimson Essence.' As the thick, sweet liquid slides down your throat, a surge of magical warmth radiates through your body. The aches in your muscles vanish and your wounds knit shut instantly.");
            updateUI(); btn.disabled = true; btn.innerText = "Health Restored";
        }
    });
    
    addChoice("Depart for the Whispering Woods", () => {
        if (!player.inventory.includes("Steel Sword") && player.health < 100) {
            clearChoices();
            writeStory("<b style='color: #e67e22'>A Stern Warning:</b> The old blacksmith stops his hammering and looks at you with pity. 'Lad, you’re walking into the jaws of death without a blade or a full belly. The woods don't forgive mistakes.'");
            addChoice("Press on regardless", forest);
            addChoice("Stay to prepare", market);
        } else { forest(); }
    });
}

function forest() {
    clearChoices();
    writeStory("<b>Chapter 4: The Whispering Woods</b>");
    writeStory("The canopy above is so thick that the world turns into a permanent twilight. The trees here seem to lean inward, their gnarled branches reaching out like skeletal fingers. Every snap of a twig sounds like a bone breaking in the oppressive silence.");
    writeStory("Suddenly, a low growl vibrates through the ground. A Shadow Stalker—a beast made of living darkness and spite—materializes from the mist, its eyes glowing like embers in the dark. It blocks the only visible path forward.");
    
    if (player.hasMap) {
        addChoice("Consult the Traveler's Map", () => {
            writeStory("You quickly unfurl the old map. In the dim light, you notice a faint trail marked in invisible ink that only glows in the dark. You lead yourself through a dense thicket of briars and find a hidden hunter's path. The beast snarls in the distance, but you have already vanished, leaving it to hunt the shadows.");
            writeLog("Evaded the beast using the map.");
            mountainPass();
        });
    }
    
    addChoice("Engage the Shadow Stalker", () => {
        if (player.inventory.includes("Steel Sword")) {
            player.gold += 25; 
            writeStory("You draw your steel and meet the beast's charge. The blade whistles through the air, carving through the creature's smoky hide. With a final, piercing shriek, the monster dissipates into a cloud of soot, leaving behind a pouch of ancient coins it had once swallowed.");
            writeLog("Victory in the forest! Found 25 Gold.");
            updateUI(); mountainPass();
        } else {
            player.health -= 60; 
            updateUI();
            if (player.health <= 0) return gameOver("The Shadow Stalker's claws found your heart.");
            writeStory("Without a weapon, you are forced to fight with desperation. You strike at the beast with heavy stones and your bare fists, taking terrible claw marks across your chest. You manage to tumble down a steep embankment to escape, but you are broken, bleeding, and exhausted.");
            writeLog("Bare-handed struggle. HP -60.");
            mountainPass();
        }
    });
}

function mountainPass() {
    clearChoices();
    writeStory("<b>Chapter 5: The Ascent of Sorrows</b>");
    writeStory("The air grows thin and freezing as you climb the jagged spine of the Frozen Peak. Snow swirls in violent eddies, stinging your eyes and numbing your fingers. Far below, the world is a distant memory of green and brown; up here, there is only the howling wind and the blinding white of the frost.");
    writeStory("You stumble upon a shallow alcove in the rock face. It offers a meager shield against the gale, and you spot some dry, petrified wood left behind by a previous climber. Your body is shivering uncontrollably, and your breath comes in ragged white puffs.");
    
    addChoice("Kindle a fire and rest", (btn) => {
        player.health = Math.min(100, player.health + 15);
        writeStory("You strike flint against steel until a tiny orange flame takes hold. The warmth is a miracle, slowly thawing your frozen joints and clearing the fog from your mind. You take a moment to eat a dry crust of bread and sharpen your resolve. As the wood turns to grey ash, you feel a flicker of your old strength returning.");
        writeLog("Rested by the fire. HP +15.");
        updateUI(); btn.disabled = true; btn.innerText = "The embers are cold";
    });

    addChoice("Push through the blizzard", mountain);
}

function mountain() {
    clearChoices();
    writeStory("<b>Chapter 6: The Hoard of the Frost Wyrm</b>");
    writeStory("You reach the summit, where a massive cavern of translucent ice glows with an inner, rhythmic light. Stepping inside, the silence is heavy. The floor is not stone, but a sea of gold coins, silver chalices, and gems the size of a man's fist. It is a king's ransom, piled high into shimmering mountains.");
    writeStory("At the center of the hoard sits a pedestal of pure sapphire. Atop it rests the **Dragon Soul Gem**, a swirling vortex of blue energy that seems to pulse like a living heart. The sheer wealth before you is enough to buy a dozen kingdoms, but the air smells of ozone and ancient scales.");
    
    addChoice("Fill your packs with gold", () => { 
        player.gold += 150; player.reputation -= 15; 
        writeStory("Greed takes hold of your heart. You shove handfuls of ancient crowns and heavy gold bars into your bags until the seams groan. You are now wealthier than the lords of Oakhaven, but you feel the weight of your choices—this gold was bought with blood, and taking it feels like a stain on your soul.");
        updateUI(); dragonEncounter(); 
    });
    
    addChoice("Claim the Magic Gem", () => { 
        player.inventory.push("Dragon Soul Gem"); 
        writeStory("You ignore the gold and reach for the sapphire pedestal. As your fingers close around the Dragon Soul Gem, a jolt of pure magical lightning surges up your arm. Your vision swims with ancient memories of flight and fire. You feel a dangerous power thrumming in your veins—a weapon that could level cities.");
        dragonEncounter(); 
    });
    
    addChoice("Leave the hoard untouched", () => { 
        player.reputation += 100; 
        writeStory("You look at the glittering sea of gold and the pulsing gem, then you slowly lower your hands. You realize that some treasures are better left to the legends. A profound sense of peace washes over you; you have conquered your own greed at the very top of the world. Your heart feels light, unburdened by the weight of stolen riches.");
        updateUI(); dragonEncounter(); 
    });
}

function dragonEncounter() {
    clearChoices();
    dragonHP = 150;
    writeStory("<b>Chapter 7: The Guardian Awakes</b>");
    
    if (player.reputation >= 100) {
        writeStory("From the ceiling of the cavern, a mountain of white scales unfurls. The Frost Dragon, a creature of myth and majesty, descends slowly. Its eyes are like pools of liquid silver, reflecting your honest face. It sniffs the air and realizes you have taken nothing from its sanctuary.");
        writeStory("'Few of your kind possess such restraint, little mortal,' the dragon’s voice echoes directly into your mind. It bows its massive, horned head in a gesture of profound respect, its icy breath misting around your boots.");
        addChoice("Speak with the Ancient One", () => {
            writeStory("You speak to the dragon of your journey and the world below. It listens with the patience of the mountains. When you finish, the dragon moves aside, letting you pass safely. You descend the mountain not with gold, but with the friendship of a god.");
            writeLog("The Saint's Path: Peaceful resolution.");
            ending();
        });
    } else {
        writeStory("A low, guttural rumble shakes the cavern, causing gold coins to cascade like water. A massive head, covered in frost-covered scales, rises from the hoard. The Frost Dragon opens its eyes—slits of burning blue rage. It sees your bulging pockets and the theft in your heart.");
        writeStory("It lets out a roar that threatens to collapse the cave, its wings snapping open and filling the entire chamber. 'Thief!' it bellows, the air turning to ice instantly. 'You shall be entombed in my frost for eternity!'");
        addChoice("Steel your nerves and fight!", dragonBattle);
    }
}

function dragonBattle() {
    clearChoices();
    updateUI();
    if (player.health <= 0) return gameOver("The dragon's final blow shattered your spirit and your body.");
    if (dragonHP <= 0) { 
        writeStory("With a final, desperate strike, you find a gap in the dragon's icy armor. The great beast lets out a dying cry that echoes across the entire mountain range before falling silent. You stand victorious over a god of the frost.");
        writeLog("The Dragon Slayer: Victory."); 
        return ending(); 
    }

    writeStory(`<b>The Dragon towers over you (HP: ${dragonHP})</b> | <b>Your Resolve (HP: ${player.health})</b>`);

    if (player.inventory.includes("Steel Sword")) {
        addChoice("Thrust with Steel Sword", () => {
            let dmg = 20 + Math.floor(Math.random() * 15);
            dragonHP -= dmg; 
            writeStory(`You lunged forward, your blade biting deep into the dragon's neck for <b>${dmg} damage</b>.`);
            dragonCounterAttack();
        });
    } else {
        addChoice("Desperate Strike (Fists)", () => { 
            dragonHP -= 5; 
            writeStory("You strike at the dragon's massive legs with your bare hands. It is like hitting a wall of diamonds; you do only 5 damage and your knuckles bleed.");
            dragonCounterAttack(); 
        });
    }

    if (player.inventory.includes("Dragon Soul Gem")) {
        addChoice("Unleash the Soul Gem", () => {
            if (Math.random() > 0.4) {
                dragonHP -= 60; 
                writeStory("You hold the gem aloft. It screams with light, firing a beam of pure ethereal energy that blasts a hole in the dragon's scales! <b>60 damage!</b>");
            } else { 
                writeStory("The gem pulses weakly, failing to respond to your command."); 
            }
            dragonCounterAttack();
        });
    }

    addChoice("Brace for Impact", () => { 
        writeStory("You dive behind a pillar of ice, curling into a ball as the dragon prepares its counter-attack.");
        dragonCounterAttack(true); 
    });
}

function dragonCounterAttack(isDefending = false) {
    clearChoices();
    let dDmg = 15 + Math.floor(Math.random() * 20);
    if (isDefending) dDmg = Math.floor(dDmg / 3);
    player.health -= dDmg;
    writeStory(`The dragon sweeps its massive tail and breathes a gout of freezing mist. You take <b>${dDmg} damage</b>.`);
    updateUI();
    if (player.health > 0) {
        addChoice("The struggle continues...", dragonBattle);
    } else {
        gameOver("The dragon's icy breath turned your blood to shards of glass.");
    }
}

function ending() {
    clearChoices();
    updateUI();
    writeStory("<b>The Long Road Home</b>");
    
    let message = "";
    if (player.reputation >= 100) {
        message = "You returned to Oakhaven not as a conqueror, but as a sage. You spent the rest of your days teaching others that the greatest treasures are found in the heart. Statues were built in your honor, and your name became a prayer for travelers in the dark.";
    } else if (player.gold > 100) {
        message = "You returned home with gold falling out of your pockets. You bought the finest mansion in the city and spent your days in luxury. Yet, sometimes at night, you hear the wind howling like a dragon, and you wonder if the price you paid for your gold was too high.";
    } else {
        message = "You returned to the village with nothing but your life and your scars. You are older and wiser now, content to sit by the fire and tell stories of the beast on the mountain to anyone who will listen. You have no gold, but you have your soul.";
    }
    
    writeStory(`<i style="color: #4a90e2">${message}</i>`);
    writeStory(`<b>Final Tally:</b> Your journey lasted ${player.day} days.`);
    addChoice("Begin a New Legend", startGame);
}