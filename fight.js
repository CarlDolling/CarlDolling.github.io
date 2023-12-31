const raceMap = new Map();
raceMap.set(1,"Dragonborn");
raceMap.set(2,"Dwarf");
raceMap.set(3,"Elf");
raceMap.set(4,"Gnome");
raceMap.set(5,"Half-Elf");
raceMap.set(6,"Half-Orc");
raceMap.set(7,"Halfling");
raceMap.set(8,"Human");
raceMap.set(9,"Tiefling");

const classMap = new Map();
classMap.set(1,"Barbarian");
classMap.set(2,"Bard");
classMap.set(3,"Cleric");
classMap.set(4,"Druid");
classMap.set(5,"Fighter");
classMap.set(6,"Monk");
classMap.set(7,"Paladin");
classMap.set(8,"Ranger");
classMap.set(9,"Rogue");
classMap.set(10,"Sorcerer");
classMap.set(11,"Warlock");
classMap.set(12,"Wizard");

let enemies = [];

//add one default attack spell for magic classes

function generateEnemies(){
    enemies = [];
    if(document.getElementById("special_preference").value > 0){
        generateSpecial();
    } else {
        let numberOfEnemies = document.getElementById("enemy_number").value;
        let enemyLevel = [parseInt(document.getElementById("enemy_level").value), parseInt(document.getElementById("lvl_strength").value)];
        let enemyRace = [parseInt(document.getElementById("race_preference").value), parseInt(document.getElementById("rp_strength").value)];
        let enemyClass = [parseInt(document.getElementById("class_preference").value), parseInt(document.getElementById("cp_strength").value)];

        for (let i = 0; i < numberOfEnemies; i++) {
            let level = calculateLevel(enemyLevel);
            let race = calculateRace(enemyRace);
            let eclass = calculateClass(enemyClass);
            let att = calculateAttributes(level, race, eclass);
            let skills = calculateSkills(level, att, eclass);
            enemies[i] = {
                level: level,
                race: raceMap.get(race),
                class: eclass,
                initiative: calculateInitiative(att[1]),
                hp: calculateHP(level,eclass,calculateModifier(att[2])),
                speed: calculateSpeed(race),
                ac: calculateAC(),
                darkvision: calculateDarkvision(race),
                immunities: calculateImmunities(race, eclass),
                advantages: calculateAdvantages(race, eclass),
                hit: caculateHit(att, eclass, level),
                spell_hit: caculateSpellHit(att, eclass, level),
                attack: calculateAttacks(eclass, att),
                spellslots: calculateSpellslots(level, eclass),
                savings: calculateSavingThrows(level, race, eclass, att),
                skills: skills,
                STR: att[0],
                DEX: att[1],
                CON: att[2],
                INT: att[3],
                WIS: att[4],
                CHA: att[5]
            }
        }
        //console.log(enemies)
        displayEnemies(enemies);
    }
}
function calculateLevel(input){
    if(input[1] == 0){
        return (Math.floor(Math.random() * 20) +1);
    }
    if(input[1] == 100){
        return input[0];
    }
    let rand = Math.floor(Math.random() * 100);
    if(rand > input[1]){
        let lvl = (input[0] + (Math.floor(Math.random() * 7) -3));
        lvl = (lvl > 20 ? 20 : lvl);
        lvl = (lvl > 0 ? lvl : 1);
        return lvl;
    } else {
        return input[0];
    }
}
function calculateRace(input){
    if(input[1] == 0){
        return (Math.floor(Math.random() * 9) +1);
    }
    if(input[1] == 100){
        return input[0];
    }
    let rand = Math.floor(Math.random() * 100);
    if(rand > input[1]){
        return (Math.floor(Math.random() * 9) +1);
    } else {
        return input[0];
    }
}
function calculateClass(input){
    if(input[1] == 0){
        return (Math.floor(Math.random() * 12) +1);
    }
    if(input[1] == 100){
        return input[0];
    }
    let rand = Math.floor(Math.random() * 100);
    if(rand > input[1]){
        return (Math.floor(Math.random() * 12) +1);
    } else {
        return input[0];
    }
}
function calculateSpeed(race){
    if(race == 1) return 30;
    if(race == 2) return 25;
    if(race == 3) return 30;
    if(race == 4) return 25;
    if(race == 5) return 30;
    if(race == 6) return 30;
    if(race == 7) return 25;
    if(race == 8) return 30;
    if(race == 9) return 30;
}
function calculateAttributes(level, race, eclass){
    let attributes = [];
    for (let i = 0; i < 6; i++) {
        attributes[i] = 10 + (Math.floor(Math.random() * 7) -3) + Math.floor(Math.random() * 3) + Math.floor(Math.random() * 3);      
    }

    if(race == 1) {attributes[0] += 2; attributes[5] += 1;}
    if(race == 2) {attributes[2] += 2;}
    if(race == 3) {attributes[1] += 2;}
    if(race == 4) {attributes[3] += 2;}
    if(race == 5) {attributes[5] += 2; attributes[1] += 1; attributes[0] += 1}
    if(race == 6) {attributes[0] += 2; attributes[2] += 1;}
    if(race == 7) {attributes[1] += 2;}
    if(race == 8) {attributes[0] += 1; attributes[1] += 1; attributes[2] += 1; attributes[3] += 1; attributes[4] += 1; attributes[5] += 1;}
    if(race == 9) {attributes[5] += 2;}

    for (let i = 0; i < 6; i++) {
        if(attributes[i] > 20) attributes[i] = 20;      
    }

    let bonusPoints = 0;
    if(level >= 4) bonusPoints += 2;
    if(level >= 8) bonusPoints += 2;
    if(level >= 12) bonusPoints += 2;
    if(level >= 16) bonusPoints += 2;
    if(level >= 19) bonusPoints += 2;
    if(level >= 6 && eclass == 5) bonusPoints += 2;
    if(level >= 14 && eclass == 5) bonusPoints += 2;
    if(level >= 10 && eclass == 9) bonusPoints += 2;
    while(bonusPoints > 0){
        let chosenAtt = Math.floor(Math.random() * 6);
        if(attributes[chosenAtt] < 20){
            attributes[chosenAtt] += 1;
            bonusPoints -= 1;
            
        }
    }
    
    return attributes;
}
function calculateSkills(level, att, eclass){
    /*
    01 Athletics        STR
    02 Acrobatics       DEX
    03 Sleight of Hand  DEX
    04 Stealth          DEX
    05 Arcana           INT
    06 History          INT
    07 Investigation    INT
    08 Nature           INT
    09 Religion         INT
    10 Animal Handling  WIS
    11 Insight          WIS
    12 Medicine         WIS
    13 Perception       WIS
    14 Survival         WIS
    15 Deception        CHA
    16 Intimidation     CHA
    17 Performance      CHA
    18 Persuasion       CHA
 */
    //+ class specific modifiers
    let skills = [];
    skills[0] = parseInt(calculateModifier(att[0]));
    skills[1] = parseInt(calculateModifier(att[1]));
    skills[2] = parseInt(calculateModifier(att[1]));
    skills[3] = parseInt(calculateModifier(att[1]));
    skills[4] = parseInt(calculateModifier(att[3]));
    skills[5] = parseInt(calculateModifier(att[3]));
    skills[6] = parseInt(calculateModifier(att[3]));
    skills[7] = parseInt(calculateModifier(att[3]));
    skills[8] = parseInt(calculateModifier(att[3]));
    skills[9] = parseInt(calculateModifier(att[4]));
    skills[10] = parseInt(calculateModifier(att[4]));
    skills[11] = parseInt(calculateModifier(att[4]));
    skills[12] = parseInt(calculateModifier(att[4]));
    skills[13] = parseInt(calculateModifier(att[4]));
    skills[14] = parseInt(calculateModifier(att[5]));
    skills[15] = parseInt(calculateModifier(att[5]));
    skills[16] = parseInt(calculateModifier(att[5]));
    skills[17] = parseInt(calculateModifier(att[5]));

    let prof = calculateProficiencyBonus(level); 


    //this should have more variety, leaving as is for now
    if(eclass == 1) {skills[0] += prof; skills[12] += prof;}
    if(eclass == 2) {skills[2] += prof; skills[5] += prof; skills[16] += prof;}
    if(eclass == 3) {skills[5] += prof; skills[11] += prof;}
    if(eclass == 4) {skills[4] += prof; skills[7] += prof;}
    if(eclass == 5) {skills[0] += prof; skills[1] += prof;}
    if(eclass == 6) {skills[0] += prof; skills[8] += prof;}
    if(eclass == 7) {skills[0] += prof; skills[10] += prof;}
    if(eclass == 8) {skills[7] += prof; skills[3] += prof;}
    if(eclass == 9) {skills[0] += prof; skills[1] += prof; skills[2] += prof; skills[3] += prof;}
    if(eclass == 10){ skills[4] += prof; skills[17] += prof;}
    if(eclass == 11){ skills[4] += prof; skills[6] += prof;}//war
    if(eclass == 12){ skills[4] += prof; skills[10] += prof;}//wiz

    for (let i = 0; i < skills.length; i++) {
        skills[i] = (skills[i] >= 0 ? "+" : "") + skills[i];
    }
    return skills;
}
function calculateHP(level, eclass, con){
    let base = 0;
    for (let i = 0; i < level; i++) {
        if(eclass == 1) base += 12
        else if(eclass == 5 || eclass == 7 || eclass == 8) base += 10
        else if(eclass == 10 || eclass == 12) base += 6
        else base += 8
        base += parseInt(con);
    }
    base -= Math.floor(level / 2);
    return base;
}
function calculateAC(){
    return ((Math.floor(Math.random() * 4) +3) + (Math.floor(Math.random() * 4) +3) + (Math.floor(Math.random() * 4) +3));
}
function calculateDarkvision(race){
    if(race == 1) return 0;
    if(race == 2) return 60;
    if(race == 3) return 60;
    if(race == 4) return 60;
    if(race == 5) return 60;
    if(race == 6) return 60;
    if(race == 7) return 0;
    if(race == 8) return 0;
    if(race == 9) return 60;
}
function calculateImmunities(race, eclass){
    let immunities = "";
    if(race == 1); //depends on draconic resistance
    if(race == 2);
    if(race == 3) immunities += "sleep magic, ";
    if(race == 4) immunities += "sleep magic, ";
    if(race == 5);
    if(race == 6);
    if(race == 7);
    if(race == 8);
    if(race == 9);
    if(eclass == 1);
    if(eclass == 2);
    if(eclass == 3);
    if(eclass == 4);
    if(eclass == 5);
    if(eclass == 6) immunities += "disease, poison, ";
    if(eclass == 7) immunities += "disease, ";
    if(eclass == 8);
    if(eclass == 9);
    if(eclass == 10);
    if(eclass == 11);
    if(eclass == 12);

    immunities = immunities.slice(0,-2);
    return immunities;
}
function calculateAdvantages(race, eclass){
    let advantages = "";
    if(race == 1) advantages += "intimidation, ";
    if(race == 2) advantages += "poison saving, ";
    if(race == 3) advantages += "being charmed, ";
    if(race == 4) advantages += "magic saving, ";
    if(race == 5) advantages += "being charmed, ";
    if(race == 6);
    if(race == 7) advantages += "being freightened, ";
    if(race == 8);
    if(race == 9) advantages += "fire damage, ";
    if(eclass == 1) advantages += "STR saving, DEX saving, ";
    if(eclass == 2);
    if(eclass == 3);
    if(eclass == 4);
    if(eclass == 5);
    if(eclass == 6);
    if(eclass == 7);
    if(eclass == 8) advantages += "survival & INT checks, saving against magical plants, ";
    if(eclass == 9);
    if(eclass == 10);
    if(eclass == 11);
    if(eclass == 12);

    advantages = advantages.substring(0, advantages.length - 2);
    return advantages;
}
function calculateAttacks(eclass, att){
    //this should be more class specific
    let rand = Math.floor(Math.random() * 3)
    if(eclass == 1) {
        if (rand == 0) return "<b>Battleaxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[0]) +" slashing damage.";
        if (rand == 1) return "<b>Glaive.</b> Melee Weapon Attack. Reach 10 ft., one target. Hit: 1d10 " +calculateModifier(att[0]) +" slashing damage.";
        if (rand == 2) return "<b>Greataxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d12 " +calculateModifier(att[0]) +" slashing damage.";
    };
    if(eclass == 2) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[1])+ " piercing damage. <br> <b>Thunderwave.</b> Casting Time: 1 action Range: Self (15-foot cube) Components: V, S Duration: Instantaneous <br> A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet. <br> At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.";
        if (rand == 1) return "<b>Spear.</b> Melee or Ranged Weapon Attack: Eeach 5 ft. or range 20/60 ft., one target. Hit: 1d6 "+calculateModifier(att[1])+" piercing damage, or 1d8 " +calculateModifier(att[1])+" piercing damage if used with two hands to make a melee attack. <br> <b>Thunderwave.</b> Casting Time: 1 action Range: Self (15-foot cube) Components: V, S Duration: Instantaneous <br> A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet. <br> At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.";
        if (rand == 2) return "<b>Greatclub.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[1])+ " bludgeoning damage. <br> <b>Thunderwave.</b> Casting Time: 1 action Range: Self (15-foot cube) Components: V, S Duration: Instantaneous <br> A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet. <br> At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.";
    };
    if(eclass == 3) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[0])+ " piercing damage. <br><b>Inflict Wounds.</b> Casting Time: 1 action Range: Touch Components: V, S Duration: Instantaneous <br>Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.";
        if (rand == 1) return "<b>Spear.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 "+calculateModifier(att[0])+" piercing damage, or 1d8 " +calculateModifier(att[0])+" piercing damage if used with two hands to make a melee attack. <br><b>Inflict Wounds.</b> Casting Time: 1 action Range: Touch Components: V, S Duration: Instantaneous <br>Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.";
        if (rand == 2) return "<b>Greatclub.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[0])+ " bludgeoning damage. <br><b>Inflict Wounds.</b> Casting Time: 1 action Range: Touch Components: V, S Duration: Instantaneous <br>Make a melee spell attack against a creature you can reach. On a hit, the target takes 3d10 necrotic damage. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d10 for each slot level above 1st.";
    };
    if(eclass == 4) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[1])+ " piercing damage. <br> <b>Thunderwave.</b> Casting Time: 1 action Range: Self (15-foot cube) Components: V, S Duration: Instantaneous <br> A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet. <br> At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.";
        if (rand == 1) return "<b>Spear.</b> Melee or Ranged Weapon Attack: Eeach 5 ft. or range 20/60 ft., one target. Hit: 1d6 "+calculateModifier(att[1])+" piercing damage, or 1d8 " +calculateModifier(att[1])+" piercing damage if used with two hands to make a melee attack. <br> <b>Thunderwave.</b> Casting Time: 1 action Range: Self (15-foot cube) Components: V, S Duration: Instantaneous <br> A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet. <br> At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.";
        if (rand == 2) return "<b>Greatclub.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[1])+ " bludgeoning damage. <br> <b>Thunderwave.</b> Casting Time: 1 action Range: Self (15-foot cube) Components: V, S Duration: Instantaneous <br> A wave of thunderous force sweeps out from you. Each creature in a 15-foot cube originating from you must make a Constitution saving throw. On a failed save, a creature takes 2d8 thunder damage and is pushed 10 feet away from you. On a successful save, the creature takes half as much damage and isn't pushed. In addition, unsecured objects that are completely within the area of effect are automatically pushed 10 feet away from you by the spell's effect, and the spell emits a thunderous boom audible out to 300 feet. <br> At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the damage increases by 1d8 for each slot level above 1st.";
    };
    if(eclass == 5) {
        if (rand == 0) return "<b>Battleaxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[1]) +" slashing damage.";
        if (rand == 1) return "<b>Glaive.</b> Melee Weapon Attack. Reach 10 ft., one target. Hit: 1d10 " +calculateModifier(att[1]) +" slashing damage.";
        if (rand == 2) return "<b>Greataxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d12 " +calculateModifier(att[1]) +" slashing damage.";
    };
    if(eclass == 6) {
        if (rand == 0) return "<b>Battleaxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[1]) +" slashing damage.";
        if (rand == 1) return "<b>Glaive.</b> Melee Weapon Attack. Reach 10 ft., one target. Hit: 1d10 " +calculateModifier(att[1]) +" slashing damage.";
        if (rand == 2) return "<b>Greataxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d12 " +calculateModifier(att[1]) +" slashing damage.";
    };
    if(eclass == 7) {
        if (rand == 0) return "<b>Spear.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 "+calculateModifier(att[1])+" piercing damage, or 1d8 " +calculateModifier(att[1])+" piercing damage if used with two hands to make a melee attack. <br><b>Searing Smite.</b> Casting Time: 1 bonus action Range: Self Components: V Duration: Concentration, up to 1 minute <br>The next time you hit a creature with a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spells ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot.";
        if (rand == 1) return "<b>Battleaxe.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d8 " +calculateModifier(att[1]) +" slashing damage. <br><b>Searing Smite.</b> Casting Time: 1 bonus action Range: Self Components: V Duration: Concentration, up to 1 minute <br>The next time you hit a creature with a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spells ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot.";
        if (rand == 2) return "<b>Glaive.</b> Melee Weapon Attack. Reach 10 ft., one target. Hit: 1d10 " +calculateModifier(att[1]) +" slashing damage. <br><b>Searing Smite.</b> Casting Time: 1 bonus action Range: Self Components: V Duration: Concentration, up to 1 minute <br>The next time you hit a creature with a melee weapon attack during the spell's duration, your weapon flares with white-hot intensity, and the attack deals an extra 1d6 fire damage to the target and causes the target to ignite in flames. At the start of each of its turns until the spell ends, the target must make a Constitution saving throw. On a failed save, it takes 1d6 fire damage. On a successful save, the spells ends. If the target or a creature within 5 feet of it uses an action to put out the flames, or if some other effect douses the flames (such as the target being submerged in water), the spell ends. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial extra damage dealt by the attack increases by 1d6 for each slot.";
    };
    if(eclass == 8) {
        if (rand == 0) return "<b>Spear.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 "+calculateModifier(att[1])+" piercing damage, or 1d8 " +calculateModifier(att[1])+" piercing damage if used with two hands to make a melee attack. <br><b>Entangle</b> Casting Time: 1 action Range: 90 feet Components: V, S Duration: Concentration, up to 1 minute <br>Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself. When the spell ends, the conjured plants wilt away.";
        if (rand == 1) return "<b>Crossbow, light.</b> Ranged Weapon Attack. Reach 80/320 ft., one target. Hit: 1d8 " +calculateModifier(att[1]) +" piercing damage. <br><b>Entangle</b> Casting Time: 1 action Range: 90 feet Components: V, S Duration: Concentration, up to 1 minute <br>Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself. When the spell ends, the conjured plants wilt away.";
        if (rand == 2) return "<b>Glaive.</b> Melee Weapon Attack. Reach 10 ft., one target. Hit: 1d10 " +calculateModifier(att[1]) +" slashing damage. <br><b>Entangle</b> Casting Time: 1 action Range: 90 feet Components: V, S Duration: Concentration, up to 1 minute <br>Grasping weeds and vines sprout from the ground in a 20-foot square starting from a point within range. For the duration, these plants turn the ground in the area into difficult terrain. A creature in the area when you cast the spell must succeed on a Strength saving throw or be restrained by the entangling plants until the spell ends. A creature restrained by the plants can use its action to make a Strength check against your spell save DC. On a success, it frees itself. When the spell ends, the conjured plants wilt away.";
    };
    if(eclass == 9) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[1])+ " piercing damage.";
        if (rand == 1) return "<b>Mace.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " bludgeoning damage.";
        if (rand == 2) return "<b>Crossbow, light.</b> Ranged Weapon Attack. Reach 80/320 ft., one target. Hit: 1d8 " +calculateModifier(att[1]) +" piercing damage.";
    };
    if(eclass == 10) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[1])+ " piercing damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
        if (rand == 1) return "<b>Handaxe.</b> Melee or Ranged Weapon Attack. Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " slashing damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
        if (rand == 2) return "<b>Quarterstaff.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " bludgeoning damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
    };
    if(eclass == 11) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[1])+ " piercing damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
        if (rand == 1) return "<b>Handaxe.</b> Melee or Ranged Weapon Attack. Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " slashing damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
        if (rand == 2) return "<b>Quarterstaff.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " bludgeoning damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
    };
    if(eclass == 12) {
        if (rand == 0) return "<b>Dagger.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d4 " +calculateModifier(att[1])+ " piercing damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
        if (rand == 1) return "<b>Handaxe.</b> Melee or Ranged Weapon Attack. Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " slashing damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
        if (rand == 2) return "<b>Quarterstaff.</b> Melee Weapon Attack. Reach 5 ft., one target. Hit: 1d6 " +calculateModifier(att[1])+ " bludgeoning damage. <br><b>Witch Bolt.</b> Casting Time: 1 action Range: 30 feet Components: V, S, M (a twig from a tree that has been struck by lightning) Duration: Concentration, up to 1 minute <br>A beam of crackling, blue energy lances out toward a creature within range, forming a sustained arc of lightning between you and the target. Make a ranged spell attack against that creature. On a hit, the target takes 1d12 lightning damage, and on each of your turns for the duration, you can use your action to deal 1d12 lightning damage to the target automatically. The spell ends if you use your action to do anything else. The spell also ends if the target is ever outside the spell’s range or if it has total cover from you. <br>At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 1d12 for each slot level above 1st.";
    };
}
function calculateSpellslots(level, eclass){
    if (eclass == 1 || eclass == 5 || eclass == 6 || eclass == 9) return "0 0 0 0 0 0 0 0 0";
    if(level >= 20) {
        return "4 3 3 3 3 2 2 1 1";
    } else if (level >= 19) {
        return "4 3 3 3 3 2 1 1 1";
    } else if (level >= 18) {
        return "4 3 3 3 3 2 1 1 1";
    } else if (level >= 17) {
        return "4 3 3 3 2 1 1 1 1";
    } else if (level >= 15) {
        return "4 3 3 3 2 1 1 1 0";
    } else if (level >= 13) {
        return "4 3 3 3 2 1 1 0 0";
    } else if (level >= 11) {
        return "4 3 3 3 2 1 0 0 0";
    } else if (level >= 10) {
        return "4 3 3 3 2 0 0 0 0";
    } else if (level >= 9) {
        return "4 3 3 3 1 0 0 0 0";
    } else if (level >= 8) {
        return "4 3 3 2 0 0 0 0 0";
    } else if (level >= 7) {
        return "4 3 3 1 0 0 0 0 0";
    } else if (level >= 6) {
        return "4 3 3 0 0 0 0 0 0"; 
    } else if (level >= 5) {
        return "4 3 2 0 0 0 0 0 0";
    } else if (level >= 4) {
        return "4 3 0 0 0 0 0 0 0";
    } else if (level >= 3) {
        return "4 2 0 0 0 0 0 0 0";
    } else if (level >= 2) {
        return "3 0 0 0 0 0 0 0 0";
    } else return "2 0 0 0 0 0 0 0 0";
}
function calculateSavingThrows(level, race, eclass, att){
    let savings = [];
    let prof = calculateProficiencyBonus(level); 

    savings[0] = parseInt(calculateModifier(att[0]));
    savings[1] = parseInt(calculateModifier(att[1]));
    savings[2] = parseInt(calculateModifier(att[2]));
    savings[3] = parseInt(calculateModifier(att[3]));
    savings[4] = parseInt(calculateModifier(att[4]));
    savings[5] = parseInt(calculateModifier(att[5]));

    if(eclass == 1){ savings[0] += prof; savings[2] += prof;}
    if(eclass == 2){ savings[1] += prof; savings[5] += prof;}
    if(eclass == 3){ savings[4] += prof; savings[5] += prof;}
    if(eclass == 4){ savings[3] += prof; savings[4] += prof;}
    if(eclass == 5){ savings[0] += prof; savings[2] += prof;}
    if(eclass == 6){ savings[0] += prof; savings[1] += prof;}
    if(eclass == 7){ savings[4] += prof; savings[5] += prof;}
    if(eclass == 8){ savings[0] += prof; savings[1] += prof;}
    if(eclass == 9) { savings[1] += prof; savings[3] += prof;}
    if(eclass == 10){ savings[2] += prof; savings[5] += prof;}
    if(eclass == 11){ savings[4] += prof; savings[5] += prof;}
    if(eclass == 12){ savings[3] += prof; savings[4] += prof;}

    for (let i = 0; i < savings.length; i++) {
        savings[i] = (savings[i] >= 0 ? "+" : "") + savings[i];
    }
    return savings;
}
function calculateProficiencyBonus(level){
    if(level >= 17) return 6;
    if(level >= 13) return 5;
    if(level >= 9) return 4;
    if(level >= 5) return 3;
    return 2;
}
function calculateModifier(score){
    let value = Math.floor((score-10)/2);
    if (value >= 0){
        return ("+" + value);
    }
    else return "" + value;
}
function exportEnemies(){
    //change values of inputs to current text
    for (let i = 0; i < enemies.length; i++) {
        document.getElementById("name"+i).setAttribute("value", document.getElementById("name"+i).value);
        document.getElementById("hp"+i).setAttribute("value", document.getElementById("hp"+i).value);
        document.getElementById("spellslots"+i).setAttribute("value", document.getElementById("spellslots"+i).value);
        document.getElementById("status"+i).innerHTML = document.getElementById("status"+i).value;
    }
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>D&D NPC Export</title>
        <style>
        body{
            background-color: antiquewhite;
        }
        .grid-container {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-template-rows: auto;
            grid-gap: 2px;
        }
        .enemy-grid {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-template-rows: auto;
            grid-gap: 5px;
        }
        .center {
            margin: auto;
            width: 97%;
            text-align: center;
        }
        .grid-item {
            border: 1px solid black;
            background-color: white;
            padding: 0.3rem;
        }
        .number {
            font-size: 2rem;
        }
        .medium-font {
            font-size: 1.5rem;
        }
        input.number {
            width: 6rem;
        }
        .status_area {
            width: 70%;
        }
        .text_top{
            vertical-align: top;
        }
        .grey {
            background-color: lightgray;
        }
        .shorter-input{
            width: 6.5rem;
        }
        .popup {
            display: none;
            position: fixed;
            left: 30vw;
            top: 10vh;
            width: 40%;
            border: 1px solid black;
            box-shadow: 2px 2px 2px 3px rgb(78, 78, 78);
            background-color: white;
            padding: 1rem;
            z-index: 99;
        
            text-align: left;
        }
        .dead-enemy{
            background-color: lightgray;
        }
        .open-button {
            font-size: 1.5rem;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .close-button {
            width: 1.5rem;
            font-size: 1.2rem;
            font-weight: 600;
            position: absolute;
            top: 0;
            right: 0.1rem;
            background: transparent;
            border: none !important;
        }
        </style>
    </head>
    <body onload="deadToggle()">
    <div id="enemy-display" class="enemy-grid center">
    ` + document.getElementById("enemy-display").innerHTML + `
    </div>
    <script>
    function deadToggle(){
        let count = document.getElementById("enemy-display").childElementCount;
        for (let i = 0; i < count; i++) {
            document.getElementById('dead'+i).addEventListener('change', (event) => {
                if (event.currentTarget.checked) {
                    document.getElementById('enemy_item'+i).classList.add("dead-enemy");
                } else {
                    document.getElementById('enemy_item'+i).classList.remove("dead-enemy");
                }
            })  
        }
    }
    function openPopup(id) {
        document.getElementById(id).style.display = "block";
    }
    function closePopup(id) {
        document.getElementById(id).style.display = "none";
    }</script>
    </body>
    </html>`));
    element.setAttribute('download', 'NPCexport.html');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
function generateSpecial(){
    let numberOfEnemies = document.getElementById("enemy_number").value;
    let enemies = [];
    let etype = document.getElementById("special_preference").value;
    for (let i = 0; i < numberOfEnemies; i++) {
        if(etype == 10081){
            enemies[i] = {
                level: "",
                race: "Merfolk",
                class: "",
                initiative: calculateInitiative(13),
                hp: "11",
                speed: "10",
                ac: "11",
                darkvision: "0",
                immunities: "",
                advantages: "",
                hit: "+2",
                attack: "<b>Spear.</b> Melee or Ranged Weapon Attack: reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 piercing damage, or 1d8 piercing damage if used with two hands to make a melee attack.",
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+0","+1","+0","+0","+0","+1"],
                skills: ["+0","+1","+1","+1","+0","+0","+0","+0","+0","+0","+0","+0","+2","+0","+1","+1","+1","+1"],
                STR: "10",
                DEX: "13",
                CON: "12",
                INT: "11",
                WIS: "11",
                CHA: "12"
            }
        } else if(etype == 10082){
            enemies[i] = {
                level: "",
                race: "Kobold",
                class: "",
                initiative: calculateInitiative(15),
                hp: "5",
                speed: "30",
                ac: "12",
                darkvision: "60",
                immunities: "",
                advantages: "disadvantage on attack rolls, as well as on perception checks (sight) in sunlight",
                hit: "+4",
                attack: `<b>Dagger.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d4 + 2 piercing damage.
                <br><b>Sling.</b> Ranged Weapon Attack: Range 30/120 ft., one target. Hit: 1d4 + 2 bludgeoning damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["-2","+2","-1","-1","-2","-1"],
                skills: ["-2","+2","+2","+2","-1","-1","-1","-1","-1","-2","-2","-2","-2","-2","-1","-1","-1","-1"],
                STR: "7",
                DEX: "15",
                CON: "9",
                INT: "8",
                WIS: "7",
                CHA: "8"
            }
        } else if(etype == 10041){
            enemies[i] = {
                level: "",
                race: "Skeleton",
                class: "",
                initiative: calculateInitiative(14),
                hp: "13",
                speed: "30",
                ac: "13",
                darkvision: "60",
                immunities: "poison, exhaustion",
                advantages: "",
                hit: "+4",
                attack: `<b>Shortsword.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 2 piercing damage.
                <br><b>Shortbow.</b> Ranged Weapon Attack: Range 80/320 ft., one target. Hit: 1d6 + 2 piercing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+0","+2","+2","-2","-1","-3"],
                skills: ["+0","+2","+2","+2","-2","-2","-2","-2","-2","-1","-1","-1","-1","-1","-3","-3","-3","-3"],
                STR: "10",
                DEX: "14",
                CON: "15",
                INT: "6",
                WIS: "8",
                CHA: "5"
            }
        } else if(etype == 10042){
            enemies[i] = {
                level: "",
                race: "Goblin",
                class: "",
                initiative: calculateInitiative(14),
                hp: "13",
                speed: "30",
                ac: "13",
                darkvision: "60",
                immunities: "",
                advantages: "",
                hit: "+4",
                attack: `<b>Scimitar.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 2 slashing damage.
                <br><b>Shortbow.</b> Ranged Weapon Attack: Range 80/320 ft., one target. Hit: 1d6 + 2 piercing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["-1","+2","+0","+0","-1","-1"],
                skills: ["-1","+2","+2","+6","+0","+0","+0","+0","+0","-1","-1","-1","-1","-1","-1","-1","-1","-1"],
                STR: "8",
                DEX: "14",
                CON: "10",
                INT: "10",
                WIS: "8",
                CHA: "8"
            }
        } else if(etype == 10){
            let variant = Math.floor(Math.random() * 4);
            enemies[i] = {
                level: "",
                race: (variant == 0 ? "Merfolk Hunter" : (variant == 1 ? "Merfolk Knight" : (variant == 2 ? "Merfolk Pikeman" : "Merfolk Seasage"))),
                class: "",
                initiative: calculateInitiative(14),
                hp: (variant == 3 ? "39" : (variant == 2 ? "45" : "33")),
                speed: (variant == 1 ? "30" : "10"),
                ac: (variant == 2 ? "16" : (variant == 3 ? "12" : "14")),
                darkvision: "0",
                immunities: "",
                hit: (variant == 3 ? "+3" : "+5"),
                spell_hit: (variant == 3 ? "+4" : null),
                advantages: (variant == 3 ? "" : (variant == 2 ? "" : "perception checks")),
                attack: (variant == 3 ? `Spear. Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 + 1 piercing damage, or 1d8 + 1 piercing damage if used with two hands to make a melee attack.
                <br>
                <br><b>Cantrips (at will):</b> air slash, druidcraft, resistance
                <br><b>1st-level (4 slots):</b> healing word, longstrider*, speak with animals, thunderwave
                <br><b>2nd-level (3 slots):</b> barkskin*, misty step
                <br>
                <br> *The merfolk casts these spells on itself before combat.` 
                : (variant == 2 ?  `Pike. Melee Weapon Attack: Reach 10 ft., one target. Hit: 1d10 + 1 piercing damage.
                <br><b>Javelin.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 30/120 ft., one target. Hit: 1d6 + 1 piercing damage.
                <br>
                <br><b>Charge.</b> If the merfolk moves at least 20 feet straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 2d6 piercing damage. It the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.
                <br><b>Parry.</b> The merfolk adds 2 to its AC against one melee attack that would hit it. To do so, the merfolk must see the attacker and be wielding a melee weapon.`
                : (variant == 1 ? `<b>Multiattack.</b> The merfolk makes two melee attacks.
                <br>
                <br><b>Longsword.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d8 + 3 slashing damage or 1d10 + 3 slashing damage if used with two hands.` 
                : `<b>Multiattack.</b> The merfolk makes two ranged attacks with its javelins.
                <br>
                <br><b>Club.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d4 + 3 bludgeoning damage.
                <br><b>Javelin.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 30/120 ft., one target. Hit: 1d6 + 3 piercing damage.
                <br><b>Net.</b> Ranged Weapon Attack: Range 5/15 ft., one Large or smaller creature. Hit: The target is restrained by netting. As an action, the restrained target can make a DC 10 Strength check, bursting the net on a success. The net can also be attacked and destroyed (AC 10; hp 5; immunity to bludgeoning, poison, and psychic damage).`))),
                spellslots: (variant == 3 ? "4 3 0 0 0 0 0 0 0" : "0 0 0 0 0 0 0 0 0"),
                savings: (variant == 3 ? ["+1","+2","+1","+3","+4","+1"] : 
                        (variant == 2 ? ["+1","+2","+2","+0","+0","+1"] : ["+3","+2","+1","+0","+1","+1"]) ),
                skills: (variant == 3 ? ["+1","+2","+2","+2","+1","+1","+1","+3","+1","+4","+2","+2","+4","+2","+1","+1","+1","+1"] : 
                        (variant == 2 ? ["+3","+2","+2","+2","+0","+0","+0","+0","+0","+0","+0","+0","+2","+0","+1","+1","+1","+1"] : 
                        (variant == 1 ? ["+3","+2","+2","+4","+0","+0","+0","+2","+0","+1","+1","+1","+3","+3","+1","+1","+1","+1"] : 
                                        ["+3","+2","+2","+6","+0","+0","+0","+4","+0","+1","+1","+1","+5","+5","+1","+1","+1","+1"]))),
                STR: (variant == 3 ? "12" : (variant == 2 ? "13" : (variant == 1 ? "16" : "16"))),
                DEX: "14",
                CON: (variant == 2 ? "15" : "12"),
                INT: (variant == 3 ? "12" : "11"),
                WIS: (variant == 3 ? "15" : (variant == 2 ? "11" : "13")),
                CHA: (variant == 3 ? "13" : "12")
            }
        } else if(etype == 11){
            enemies[i] = {
                level: "",
                race: "Death Dog",
                class: "",
                initiative: calculateInitiative(14),
                hp: "39",
                speed: "40",
                ac: "12",
                darkvision: "0",
                immunities: "",
                advantages: "advantage on perception checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious",
                hit: "+5",
                attack: `<b>Multiattack.</b> The dog makes two bite attacks.
                <br><b>Bite.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 2 piercing damage. If the target is a creature, it must succeed on a DC 12 Constitution saving throw against disease or become poisoned until the disease is cured. Every 24 hours that elapse, the creature must repeat the saving throw, reducing its hit point maximum by 5 (1d10) on a failure. This reduction lasts until the disease is cured. The creature dies if the disease reduces its hit point maximum to 0.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+2","+2","+2","-4","+1","-2"],
                skills: ["+2","+2","+2","+4","-4","-4","-4","-4","-4","+1","+1","+1","+5","+1","-2","-2","-2","-2"],
                STR: "15",
                DEX: "14",
                CON: "14",
                INT: "3",
                WIS: "13",
                CHA: "6"
            }
        } else if(etype == 20){
            enemies[i] = {
                level: "",
                race: "Sea Slime",
                class: "",
                initiative: calculateInitiative(4),
                hp: "58",
                speed: "10",
                ac: "7",
                darkvision: "0",
                immunities: "blinded, charmed, deafened, exhaustion, frightened, prone",
                advantages: "stealth checks (in water)",
                hit: "+5",
                attack: "<b>Pseudopod.</b> Melee Weapon Attack: Reach 5 ft., one creature. Hit: 1d8 + 2 bludgeoning damage plus 3d4 acid damage.",
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+2","-3","+2","-4","-2","-4"],
                skills: ["+2","-3","-3","-3","-4","-4","-4","-4","-4","-2","-2","-2","-2","-2","-4","-4","-4","-4"],
                STR: "15",
                DEX: "4",
                CON: "15",
                INT: "2",
                WIS: "6",
                CHA: "2"
            }
        } else if(etype == 21){
            enemies[i] = {
                level: "",
                race: "Dragonfly",
                class: "",
                initiative: calculateInitiative(18),
                hp: "44",
                speed: "10",
                ac: "16",
                darkvision: "60",
                immunities: "",
                advantages: "fire resistance",
                hit: "+3",
                attack: `<b>Bite.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d6 + 1 piercing damage.
                <br><b>Breath Weapon (Recharge 5-6).</b> The dragonfly exhales energy corresponding with the colour of dragon that it is a hybrid of in a 15-foot cone (green, red, or white) or a 30-foot line that is 5 feet wide (black or blue). Each creature in that area must make a DC 11 Dexterity (black, blue, or red) or Constitution (green or white) saving throw, taking 4d8 damage of the type that it resists on a failed save, or half as much damage on a successful one.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+1","+4","+1","-4","+1","-4"],
                skills: ["+1","+4","+4","+4","-4","-4","-4","-4","-4","+1","+1","+1","+1","+1","-4","-4","-4","-4"],
                STR: "12",
                DEX: "18",
                CON: "12",
                INT: "2",
                WIS: "12",
                CHA: "3"
            }
        } else if(etype == 22){
            enemies[i] = {
                level: "",
                race: "Goblin Soldier",
                class: "",
                initiative: calculateInitiative(16),
                hp: "27",
                speed: "30",
                ac: "17",
                darkvision: "60",
                immunities: "",
                advantages: "",
                hit: "+5",
                attack: `</b>Multiattack.</b> The goblin soldier makes two attacks.
                <br>
                <br><b>Rapier.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d8 + 3 piercing damage.
                <br><b>Shortbow.</b> Ranged Weapon Attack: Range 80/320 ft., one target. Hit: 1d6 + 3 piercing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+1","+3","+1","+0","-1","-1"],
                skills: ["+3","+3","+3","+7","+0","+0","+0","+0","+0","-1","-1","-1","-1","+1","-1","-1","-1","-1"],
                STR: "12",
                DEX: "16",
                CON: "12",
                INT: "10",
                WIS: "8",
                CHA: "8"
            }
        } else if(etype == 23){
            enemies[i] = {
                level: "",
                race: "Half-Troll",
                class: "",
                initiative: calculateInitiative(13),
                hp: "47",
                speed: "30",
                ac: "13",
                darkvision: "60",
                immunities: "",
                advantages: "",
                hit: "+5",
                attack: `<b>Multiattack.</b> The half-troll makes two attacks: one with its bite and one with its war pick.
                <br>
                <br><b>Bite.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 3 piercing damage.
                <br><b>War Pick.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d8 + 3 piercing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+3","+1","+4","-1","+0","-1"],
                skills: ["+3","+1","+1","+1","-1","-1","-1","-1","-1","+0","+0","+0","+2","+0","-1","-1","-1","-1"],
                STR: "16",
                DEX: "13",
                CON: "18",
                INT: "9",
                WIS: "10",
                CHA: "9"
            }
        } else if(etype == 24){
            enemies[i] = {
                level: "",
                race: "Kobold Boss",
                class: "",
                initiative: calculateInitiative(14),
                hp: "33",
                speed: "30",
                ac: "17",
                darkvision: "60",
                immunities: "",
                advantages: "disadvantage in sunlight on attacks",
                hit: "+5",
                attack: `<b>Multiattack.</b> The kobold makes two melee attacks; one with its scimitar, and one with its dagger.
                <br>
                <br><b>Scimitar.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 3 slashing damage.
                <br><b>Dagger.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 1d4 + 3 piercing damage.
                <br><b>Javelin.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 30/120 ft., one target. Hit: 1d6 + 2 piercing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+1","+2","+2","+0","+0","+1"],
                skills: ["+1","+2","+2","+2","+0","+0","+0","+0","+0","+0","+0","+0","+0","+1","+1","+1","+1","+1"],
                STR: "13",
                DEX: "14",
                CON: "15",
                INT: "11",
                WIS: "11",
                CHA: "12"
            }
        } else if(etype == 25){
            enemies[i] = {
                level: "",
                race: "Man-Eating Plant",
                class: "",
                initiative: calculateInitiative(10),
                hp: "17",
                speed: "5",
                ac: "14",
                darkvision: "0",
                immunities: "poison, blinded, deafened, frightened, paralyzed, poisoned, prone",
                advantages: "",
                hit: "+5",
                attack: `<b>Vine Whip.</b> Melee Weapon Attack: Reach 10 ft., one target. Hit: 1d6 + 3 bludgeoning damage and the creature is restrained until the end of the man-eating plant's next turn. The plant can pull the creature up to 5 feet closer.
                <br><b>Paralysis Barbs.</b> Ranged Weapon Attack: Reach 30 ft., one target. Hit: 1d8 poison damage and the creature must succeed on a DC 11 Constitution saving throw or become paralyzed until the end of its next turn.
                <br><b>Swallow.</b> The plant swallows a Medium or smaller creature within 5 feet of it that is paralyzed or restrained. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the plant, and it takes 2d4 acid damage at the start of each of the plant's turns. The man-eating plant can have only one target swallowed at a time.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+3","+0","+3","-2","+0","-1"],
                skills: ["+3","+0","+0","+0","-2","-2","-2","-2","-2","+0","+0","+0","+2","+0","-1","-1","-1","-1"],
                STR: "16",
                DEX: "10",
                CON: "17",
                INT: "7",
                WIS: "10",
                CHA: "8"
            }
        } else if(etype == 26){
            enemies[i] = {
                level: "",
                race: "Vampyre",
                class: "",
                initiative: calculateInitiative(14),
                hp: "39",
                speed: "30",
                ac: "13",
                darkvision: "60",
                immunities: "",
                advantages: "",
                hit: "+4",
                attack: `<b>Multiattack.</b> The vampyre makes two attacks: one with its claws and one with its bite.
                <br>
                <br><b>Claws.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 3 slashing damage. Instead of dealing damage, the vampyre can grapple the target (escape DC 12).
                <br><b>Bite.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 3 piercing damage and the target must succeed a DC 13 Wisdom saving throw or be charmed by the vampyre. While charmed the target sees the vampyre as a trusted authority figure to be protected. Each time the vampyre or the vampyre's allies do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 10 minutes or until the vampyre is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect.
                <br><b>Blood Drain.</b> Melee Weapon Attack: Reach 5 ft., one willing creature, or a creature that is grappled by the vampyre, incapacitated, or restrained. Hit: 1d6 + 3 piercing damage and 2d6 necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken, and the vampyre heals hit points equal to half the amount drained. The reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+2","+2","+2","+1","+1","+2"],
                skills: ["+2","+2","+2","+4","+1","+1","+1","+1","+1","+1","+1","+1","+1","+1","+4","+2","+2","+2"],
                STR: "14",
                DEX: "14",
                CON: "14",
                INT: "12",
                WIS: "13",
                CHA: "15"
            }
        } else if(etype == 27){
            enemies[i] = {
                level: "",
                race: "Ogre",
                class: "",
                initiative: calculateInitiative(8),
                hp: "59",
                speed: "40",
                ac: "11",
                darkvision: "60",
                immunities: "",
                advantages: "",
                hit: "+6",
                attack: `<b>Greatclub.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d8 + 4 bludgeoning damage.
                <br><b>Javelin.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 30/120 ft., one target. Hit: 2d6 + 4 piercing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+4","-1","+3","-3","-2","-2"],
                skills: ["+4","-1","-1","-1","-3","-3","-3","-3","-3","-2","-2","-2","-2","-2","-2","-2","-2","-2"],
                STR: "19",
                DEX: "8",
                CON: "16",
                INT: "5",
                WIS: "7",
                CHA: "7"
            }
        } else if(etype == 30){
            enemies[i] = {
                level: "",
                race: "Werewolf",
                class: "",
                initiative: calculateInitiative(13),
                hp: "58",
                speed: "40",
                ac: "12",
                darkvision: "0",
                immunities: "bludgeoning, piercing, and slashing damage",
                advantages: "perceptions checks (smell)",
                hit: "+4",
                attack: `<b>Multiattack (Humanoid or Hybrid Form Only).</b> The werewolf makes two attacks: one with its bite and one with its claws or spear.
                <br>
                <br><b>Bite (Wolf or Hybrid Form Only).</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d8 + 2 piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy.
                <br><b>Claws (Hybrid Form Only).</b> Melee Weapon Attack: Reach 5 ft., one creature. Hit: 2d4 + 2 slashing damage.
                <br><b>Spear (Humanoid Form Only).</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one creature. Hit: 1d6 + 2 piercing damage, or 1d8 + 2 piercing damage if used with two hands to make a melee attack.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+2","+1","+2","+0","+0","+0"],
                skills: ["+2","+1","+1","+3","+0","+0","+0","+0","+0","+0","+0","+0","+0","+0","+0","+0","+0","+0"],
                STR: "15",
                DEX: "13",
                CON: "14",
                INT: "10",
                WIS: "11",
                CHA: "10"
            }
        } else if(etype == 50){
            enemies[i] = {
                level: "",
                race: "Troll",
                class: "",
                initiative: calculateInitiative(13),
                hp: "84",
                speed: "30",
                ac: "15",
                darkvision: "60",
                immunities: "",
                advantages: "perception checks (smell), +10hp at start of turn (unless on fire or acid)",
                hit: "+7",
                attack: `<b>Multiattack.</b> The troll makes three attacks: one with its bite and two with its claws.
                <br>
                <br><b>Bite.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 1d6 + 4 piercing damage.
                <br><b>Claws.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d6 + 4 slashing damage.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+4","+1","+5","-2","-1","-2"],
                skills: ["+4","+1","+1","+1","-2","-2","-2","-2","-2","-1","-1","-1","+2","-1","-2","-2","-2","-2"],
                STR: "18",
                DEX: "13",
                CON: "20",
                INT: "7",
                WIS: "9",
                CHA: "7"
            }
        } else if(etype == 60){
            enemies[i] = {
                level: "",
                race: "Wyvern",
                class: "",
                initiative: calculateInitiative(10),
                hp: "110",
                speed: "20",
                ac: "13",
                darkvision: "60",
                immunities: "",
                advantages: "",
                hit: "+7",
                attack: `<b>Multiattack.</b> The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack.
                <br>
                <br><b>Bite.</b> Melee Weapon Attack: Reach 10 ft., one creature. Hit: 2d6 + 4 piercing damage.
                <br><b>Claws.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d8 + 4 slashing damage.
                <br><b>Sting.</b> Melee Weapon Attack: Reach 10 ft., one creature. Hit: 2d6 + 4 piercing damage. The target must make a DC 15 Constitution saving throw, taking 7d6 poison damage on a failed save, or half as much damage on a successful one.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+4","+0","+3","-3","+1","-2"],
                skills: ["+4","+0","+0","+0","-3","-3","-3","-3","-3","+1","+1","+1","+5","+1","-2","-2","-2","-2"],
                STR: "19",
                DEX: "10",
                CON: "16",
                INT: "5",
                WIS: "12",
                CHA: "6"
            }
        } else if(etype == 61){
            enemies[i] = {
                level: "",
                race: "Merfolk Stormbrewer",
                class: "",
                initiative: calculateInitiative(14),
                hp: "67",
                speed: "10",
                ac: "12",
                darkvision: "0",
                immunities: "",
                advantages: "",
                hit: "+5",
                spell_hit: "+7",
                attack: `<b>Spear.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 1d6 + 2 piercing damage, or 1d8 + 2 piercing damage if used with two hands to make a melee attack.
                <br>
                <br><b>Cantrips (at will):</b> air slash, lightning field, mage hand, message, shocking grasp
                <br><b>1st-level (4 slots):</b> mage armor*, thunderwave
                <br><b>2nd-level (3 slots):</b> mirror image, misty step, shatter
                <br><b>3rd-level (3 slots):</b> fly, lightning bolt
                <br><b>4th-level (1 slot):</b> ice storm
                <br>
                <br>*The merfolk casts these spells on itself before combat.`,
                spellslots: "4 3 3 1 0 0 0 0 0",
                savings: ["+2","+2","+6","+0","+3","+7"],
                skills: ["+2","+2","+2","+2","+3","+0","+0","+0","+0","+0","+0","+0","+3","+0","+4","+4","+4","+4"],
                STR: "14",
                DEX: "14",
                CON: "16",
                INT: "11",
                WIS: "11",
                CHA: "19"
            }
        } else if(etype == 70){
            enemies[i] = {
                level: "",
                race: "Merfolk Hoplite",
                class: "",
                hp: "150",
                speed: "10",
                ac: "18",
                darkvision: "0",
                immunities: "",
                advantages: "makes three melee or two ranged attacks",
                hit: "+8",
                attack: `<b>Multiattack.</b> The merfolk makes three melee attacks or two ranged attacks.
                <br>
                <br><b>Trident.</b> Melee or Ranged Weapon Attack: Reach 5 ft. or range 20/60 ft., one target. Hit: 2d6 + 5 piercing damage if used with one hand to make a melee attack, 2d8 + 5 piercing damage if used with two hands to make a melee attack, or 1d6 + 5 piercing damage at range.
                <br><b>Shield Bash.</b> Melee Weapon Attack: Reach 5 ft., one creature. Hit: 2d4 + 5 bludgeoning damage. If the target is a Medium or smaller creature, it must succeed on a DC 16 Strength saving throw or be knocked prone.
                <br>
                <br><b>Parry.</b> The merfolk adds 3 to its AC against one melee attack that would hit it. To do so, the merfolk must see the attacker and be wielding a melee weapon.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+8","+5","+6","+0","+0","+0"],
                skills: ["+8","+2","+2","+2","+0","+0","+0","+0","+0","+2","+2","+2","+5","+2","+1","+4","+1","+1"],
                STR: "20",
                DEX: "14",
                CON: "17",
                INT: "11",
                WIS: "14",
                CHA: "12"
            }
        } else if(etype == 71){
            enemies[i] = {
                level: "",
                race: "Stone Giant",
                class: "",
                initiative: calculateInitiative(15),
                hp: "126",
                speed: "40",
                ac: "17",
                darkvision: "60",
                immunities: "",
                advantages: "stealth checks in rocky terrain",
                hit: "+9",
                attack: `<b>Multiattack.</b> The giant makes two greatclub attacks.
                <br>
                <br><b>Greatclub.</b> Melee Weapon Attack: Reach 15 ft., one target. Hit: 3d8 + 6 bludgeoning damage.
                <br><b>Rock.</b> Ranged Weapon Attack: Range 60/240 ft., one target. Hit: 4d10 + 6 bludgeoning damage. If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone.
                <br>
                <br><b>Rock Catching.</b> If a rock or similar object is hurled at the giant, the giant can, with a successful DC 10 Dexterity saving throw, catch the missile and take no bludgeoning damage from it.`,
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+6","+5","+8","+0","+5","+0"],
                skills: ["+12","+2","+2","+2","+0","+0","+0","+0","+0","+1","+1","+1","+4","+1","-1","-1","-1","-1"],
                STR: "23",
                DEX: "15",
                CON: "20",
                INT: "10",
                WIS: "12",
                CHA: "9"
            }
        } else if(etype == 100){
            enemies[i] = {
                level: "",
                race: "Guardian Naga",
                class: "",
                initiative: calculateInitiative(4),
                hp: "127",
                speed: "40",
                ac: "18",
                darkvision: "0",
                immunities: "poison, charmed",
                advantages: "",
                hit: "+8",
                spell_hit: "+8",
                attack: "<b>Bite.</b> Melee Weapon Attack: Reach 10 ft., one creature. Hit: 1d8 + 4 piercing damage, and the target must make a DC 15 Constitution saving throw, taking 10d8 poison damage on a failed save, or half as much damage on a successful one.<br><b>Spit Poison.</b> Ranged Weapon Attack: Range 15/30 ft., one creature. Hit: The target must make a DC 15 Constitution saving throw, taking 10d8 poison damage on a failed save, or half as much damage on a successful one.<br><br><b>Cantrips</b> (at will): mending, sacred flame, thaumaturgy<br><b>1st level</b> (4 slots): command, cure wounds, shield of faith<br><b>2nd level</b> (3 slots): calm emotions, hold person<br><b>3rd level</b> (3 slots): bestow curse, clairvoyance<br><b>4th level</b> (3 slots): banishment, freedom of movement<br><b>5th level</b> (2 slots): flame strike, geas<br><b>6th level</b> (1 slot): true seeing",
                spellslots: "4 3 3 3 3 2 1 0 0",
                savings: ["+4","+8","+7","+7","+8","+8"],
                skills: ["+4","+4","+4","+4","+3","+3","+3","+3","+3","+4","+4","+4","+4","+4","+4","+4","+4","+4"],
                STR: "19",
                DEX: "18",
                CON: "16",
                INT: "16",
                WIS: "19",
                CHA: "18"
            }
        } else if(etype == 140){
            enemies[i] = {
                level: "",
                race: "Ice Devil",
                class: "",
                initiative: calculateInitiative(14),
                hp: "180",
                speed: "40",
                ac: "18",
                darkvision: "120",
                immunities: "poison, cold, fire",
                advantages: "bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered, saving against magic",
                hit: "+10",
                attack: "<b>Multiattack.</b> The devil makes three attacks: one with its bite, one with its claws, and one with its tail.<br><br><b>Bite.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d6 + 5 piercing damage plus 3d6 cold damage.<br><b>Claws.</b> Melee Weapon Attack: Reach 5 ft., one target. Hit: 2d4 + 5 slashing damage plus 3d6 cold damage.<br><b>Tail.</b> Melee Weapon Attack: Reach 10 ft., one target. Hit: 2d6 + 5 bludgeoning damage plus 3d6 cold damage.<br><b>Wall of Ice (Recharge 6).</b> The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter. When the wall appears, each creature in its space is pushed out of it by the shortest route. The creature chooses which side of the wall to end up on, unless the creature is incapacitated. The creature then makes a DC 17 Dexterity saving throw, taking 10d6 cold damage on a failed save, or half as much damage on a successful one. The wall lasts for 1 minute or until the devil is incapacitated or dies. The wall can be damaged and breached; each 10-foot section has AC 5, 30 hit points, vulnerability to fire damage, and immunity to acid, cold, necrotic, poison, and psychic damage. If a section is destroyed, it leaves behind a sheet of frigid air in the space the wall occupied. Whenever a creature finishes moving through the frigid air on a turn, willingly or otherwise, the creature must make a DC 17 Constitution saving throw, taking 5d6 cold damage on a failed save, or half as much damage on a successful one. The frigid air dissipates when the rest of the wall vanishes.",
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+5","+7","+9","+4","+7","+9"],
                skills: ["+5","+2","+2","+2","+4","+4","+4","+4","+4","+2","+2","+2","+2","+2","+4","+4","+4","+4"],
                STR: "21",
                DEX: "14",
                CON: "18",
                INT: "18",
                WIS: "15",
                CHA: "18"
            }
        } else if(etype == 150){
            enemies[i] = {
                level: "",
                race: "Purple Worm",
                class: "",
                initiative: calculateInitiative(7),
                hp: "247",
                speed: "50",
                ac: "18",
                darkvision: "0",
                immunities: "",
                advantages: "",
                hit: "+9",
                attack: "<b>Multiattack.</b> The worm makes two attacks: one with its bite and one with its stinger.<br><br><b>Bite.</b> Melee Weapon Attack: Reach 10 ft., one target. Hit: 3d8 + 9 piercing damage. If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm. A swallowed creature is blinded and restrained, it has total cover against attacks and other effects outside the worm, and it takes 6d6 acid damage at the start of each of the worm's turns. If the worm takes 30 damage or more on a single turn from a creature inside it, the worm must succeed on a DC 21 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the worm. If the worm dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 20 feet of movement, exiting prone.<br><b>Stinger.</b> Melee Weapon Attack: Reach 10 ft., one creature. Hit: 3d6 + 9 piercing damage, and the target must make a DC 19 Constitution saving throw, taking 12d6 poison damage on a failed save, or half as much damage on a successful one.",
                spellslots: "0 0 0 0 0 0 0 0 0",
                savings: ["+9","-2","+11","-4","+4","-4"],
                skills: ["+9","-2","-2","-2","-5","-5","-5","-5","-5","-1","-1","-1","-1","-1","-3","-3","-3","-3"],
                STR: "28",
                DEX: "7",
                CON: "22",
                INT: "1",
                WIS: "8",
                CHA: "4"
            }
        }
    }
    //console.log(enemies)
    
    displayEnemies(enemies);
}
function caculateHit(att, eclass, level){
//Ability Modifier + Proficiency + Enchanted Item Bonus + Class Features = Attack Bonun
    let hit;
    if(eclass == 1) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[0]));
    }
    else if(eclass == 2) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 3) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[0]));
    }
    else if(eclass == 4) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 5) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 6) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 7) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 8) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 9) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 10) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 11) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    }
    else if(eclass == 12) {
        hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[1]));
    } else hit = 0;

    if (hit >= 0){
        return ("+" + hit);
    }
    else return ""+ hit;
}
function caculateSpellHit(att, eclass, level){
        let hit = 100;
        if(eclass == 2) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[5]));
        }
        else if(eclass == 3) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[4]));
        }
        else if(eclass == 4) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[4]));
        }
        else if(eclass == 7) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[4]));
        }
        else if(eclass == 8) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[4]));
        }
        else if(eclass == 10) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[5]));
        }
        else if(eclass == 11) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[5]));
        }
        else if(eclass == 12) {
            hit = calculateProficiencyBonus(level) + parseInt(calculateModifier(att[3]));
        }
    
        if(hit == 100) {
            return null;
        }
        if (hit >= 0){
            return ("+" + hit);
        } else return ""+ hit;
}
function openPopup(id) {
    document.getElementById(id).style.display = "block";
}
function closePopup(id) {
    document.getElementById(id).style.display = "none";
}
function calculateInitiative(dex){
    let ini = parseInt(calculateModifier(dex));
    ini += (Math.floor(Math.random() * 20) +1);
    if (ini >= 0){
        return ("+" + ini);
    }
    else return ""+ ini;
}
function displayEnemies(enemies){
    let display = document.getElementById("enemy-display");
    display.innerHTML = "";

    enemies.sort((a,b) => b.initiative - a.initiative);

    for (let i = 0; i < enemies.length; i++) {
        let htmlString = "";
        htmlString += `<div class="grid-item" id="enemy_item`+i+`">
                       <div class="medium-font" id="enemy_name"><input class="medium-font" type="text" id="name`+i+`" value="Enemy ` + i + `">, `;
        htmlString += enemies[i].race + (enemies[i].class == "" ? "" : (", "+ classMap.get(enemies[i].class))) + "</div>";
        htmlString += `<div class="number">Hit Points: <input class="number" type="number" id="hp`+i+`" value="` +enemies[i].hp + '">/' + enemies[i].hp;
        htmlString += `, <input type="checkbox" id="dead`+i+`"> dead</div>`;
        htmlString += `<div class="medium-font">` + (enemies[i].level == "" ? "" : "Level ") + enemies[i].level + (enemies[i].level == "" ? "" : ", ") +`AC ` + enemies[i].ac + `, Initiative ` + enemies[i].initiative +`, Speed ` + enemies[i].speed + `, Darkvision: `+ enemies[i].darkvision +`</div>`;
        htmlString += `<div>` + ((enemies[i].immunities == "" && enemies[i].advantages == "") ? "<br>" : "") + (enemies[i].immunities != "" ? "Immunities: ": "") + enemies[i].immunities +  ((enemies[i].immunities != "" && enemies[i].advantages != "") ? "; " : "") + (enemies[i].advantages != "" ? "Advantages: ": "")+ enemies[i].advantages +`</div>`;
        htmlString += `<br><div><span class="text_top">Status / Notes: </span><textarea class="status_area" rows="3" id="status`+i+`"></textarea></div>`;
        htmlString += `<div><button class="open-button" onclick="openPopup('attack-popup` + i + `')">Show Attacks & Spells</button></div>`; //+ enemies[i].attack +`</div>`;
        htmlString += `<div>Spellslots: <input class="shorter-input" type="text" id="spellslots`+i+`" value="` + enemies[i].spellslots +`"></div>`;
        htmlString += `<br><div class="grid-container center">
                        <div class="grid-item grey"><div>STR `+ enemies[i].STR +` (`+ calculateModifier(enemies[i].STR) +`)</div><div>`+ enemies[i].savings[0] + ` saving throw</div></div>
                        <div class="grid-item grey"><div>DEX `+ enemies[i].DEX +` (`+ calculateModifier(enemies[i].DEX) +`)</div><div>`+ enemies[i].savings[1] + ` saving throw</div></div>
                        <div class="grid-item grey"><div>CON `+ enemies[i].CON +` (`+ calculateModifier(enemies[i].CON) +`)</div><div>`+ enemies[i].savings[2] + ` saving throw</div></div>
                        <div class="grid-item">
                            <div>Athletics `+ enemies[i].skills[0] + `</div>
                        </div>
                        <div class="grid-item">
                            <div>Acrobatics `+ enemies[i].skills[1] +`</div>
                            <div>Sleight of Hand `+ enemies[i].skills[2] +`</div>
                            <div>Stealth `+ enemies[i].skills[3] + `</div>
                        </div>
                        <div class="grid-item">
                        </div>
                        <div class="grid-item grey"><div>INT `+ enemies[i].INT +` (`+ calculateModifier(enemies[i].INT) +`)</div><div>`+ enemies[i].savings[3] + ` saving throw</div></div>
                        <div class="grid-item grey"><div>WIS `+ enemies[i].WIS +` (`+ calculateModifier(enemies[i].WIS) +`)</div><div>`+ enemies[i].savings[4] + ` saving throw</div></div>
                        <div class="grid-item grey"><div>CHA `+ enemies[i].CHA +` (`+ calculateModifier(enemies[i].CHA) +`)</div><div>`+ enemies[i].savings[5] + ` saving throw</div></div>`;
        htmlString += `<div class="grid-item">
                            <div>Arcana `+ enemies[i].skills[4] + `</div>
                            <div>History `+ enemies[i].skills[5] + `</div>
                            <div>Investigation `+ enemies[i].skills[6] +`</div>
                            <div>Nature `+ enemies[i].skills[7] +`</div>
                            <div>Religion `+ enemies[i].skills[8] +`</div>
                        </div>
                        <div class="grid-item">
                            <div>Animal Handling `+ enemies[i].skills[9] +`</div>
                            <div>Insight `+ enemies[i].skills[10] +`</div>
                            <div>Medicine `+ enemies[i].skills[11] +`</div>
                            <div>Perception `+ enemies[i].skills[12] +`</div>
                            <div>Survival `+ enemies[i].skills[13] +`</div>
                        </div>
                        <div class="grid-item">
                            <div>Deception `+ enemies[i].skills[14] +`</div>
                            <div>Intimidation `+ enemies[i].skills[15] +`</div>
                            <div>Performance `+ enemies[i].skills[16] +`</div>
                            <div>Persuasion `+ enemies[i].skills[17] +`</div>
                        </div>
                    </div>`
        htmlString += `<div class="popup" id="attack-popup` + i + `">
                            <button class="close-button" onclick="closePopup('attack-popup` + i + `')">X</button>
                            <p>Physical Hit: ` + enemies[i].hit + (enemies[i].spell_hit ? ", Spell Hit: " : "") + (enemies[i].spell_hit ? enemies[i].spell_hit : "") + `</p>
                            ` + enemies[i].attack + `
                        </div>`
        htmlString += "</div>";
        
        display.innerHTML += htmlString;

              
    }
    for (let i = 0; i < enemies.length; i++) {
        document.getElementById('dead'+i).addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                document.getElementById('enemy_item'+i).classList.add("dead-enemy");
            } else {
                document.getElementById('enemy_item'+i).classList.remove("dead-enemy");
            }
        })  
    }
}