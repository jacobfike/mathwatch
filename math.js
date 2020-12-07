const units = [
  {
    name: "Light Infantry",
    toughness: 3,
    save: 5,
    wounds: 1,
    cost: 10,
  },
  {
    name: "Space Marines",
    toughness: 4,
    save: 3,
    wounds: 2,
    cost: 20,
  },
  {
    name: "Chaos Demons",
    toughness: 4,
    save: 5,
    invul: 5,
    wounds: 1,
    cost: 15,
  },
  {
    name: "Terminators",
    toughness: 4,
    save: 2,
    invul: 5,
    wounds: 3,
    cost: 40,
  },
  {
    name: "Characters",
    toughness: 4,
    save: 3,
    invul: 4,
    wounds: 6,
    cost: 100,
  },
  {
    name: "Light Vehicles",
    toughness: 6,
    save: 3,
    wounds: 8,
    cost: 150,
  },
  {
    name: "Heavy Vehicles",
    toughness: 8,
    save: 3,
    invul: 5,
    wounds: 16,
    cost: 300,
  },
  {
    name: "Gravis Marines",
    toughness: 5,
    save: 3,
    wounds: 3,
    cost: 30,
  },
];

const input = [
  {
    name: "Veterans",
    cpm: 20,
    ws: 3,
    number: 4,
    weapons: [
      {
        name: "Infernus Heavy Bolter",
        cost: 15,
        both: true,
        profiles: [
          {
            name: "Bolter",
            type: "Heavy",
            shots: 3,
            s: 5,
            ap: 1,
            d: 2,
          },
          {
            name: "Flamer",
            type: "Heavy",
            shots: "D6",
            s: 5,
            ap: 1,
            d: 1,
          },
        ],
      },
      {
        name: "Power Sword",
        cost: 3,
        profiles: [
          {
            type: "Melee",
            shots: 3,
            s: 5,
            ap: 3,
            d: 1,
          },
        ],
      },
    ],
  },
  {
    name: "Veterans",
    cpm: 20,
    ws: 3,
    number: 5,
    weapons: [
      {
        name: "Deathwatch Combi-flamer",
        cost: 5,
        both: true,
        profiles: [
          {
            name: "Bolter",
            type: "Rapid Fire",
            sia: true,
            shots: 2,
            s: 4,
            ap: 1,
            d: 1,
          },
          {
            name: "Flamer",
            type: "Assault",
            shots: "D6",
            s: 4,
            ap: 0,
            d: 1,
          },
        ],
      },
      {
        name: "Power Sword",
        cost: 3,
        profiles: [
          {
            type: "Melee",
            shots: 3,
            s: 5,
            ap: 3,
            d: 1,
          },
        ],
      },
    ],
  },
  {
    name: "Veterans",
    cpm: 20,
    ws: 3,
    number: 5,
    weapons: [
      {
        name: "Deathwatch Combi-melta",
        cost: 10,
        both: true,
        profiles: [
          {
            name: "Bolter",
            type: "Rapid Fire",
            sia: true,
            shots: 2,
            s: 4,
            ap: 1,
            d: 1,
          },
          {
            name: "Melta",
            type: "Assault",
            shots: 1,
            s: 8,
            ap: 4,
            d: "D6",
          },
        ],
      },
      {
        name: "Power Sword",
        cost: 3,
        profiles: [
          {
            type: "Melee",
            shots: 3,
            s: 5,
            ap: 3,
            d: 1,
          },
        ],
      },
    ],
  },
  {
    name: "Veterans",
    cpm: 20,
    ws: 3,
    number: 5,
    weapons: [
      {
        name: "Deathwatch Combi-melta",
        cost: 10,
        both: true,
        profiles: [
          {
            name: "Bolter",
            type: "Rapid Fire",
            sia: true,
            shots: 2,
            s: 4,
            ap: 1,
            d: 1,
          },
          {
            name: "Melta",
            type: "Assault",
            shots: 1,
            s: 8,
            ap: 4,
            d: "D6",
          },
        ],
      },
      {
        name: "Astartes Chainsword",
        cost: 0,
        profiles: [
          {
            type: "Melee",
            shots: 4,
            s: 4,
            ap: 1,
            d: 1,
          },
        ],
      },
    ],
  },
];

input.forEach((unit) => {
  units.forEach((target) => {
    console.log(`${unit.name} fighting ${target.name}`);
    calc(unit, target);
  });
});

function calc(unit, target) {
  let hits, wounds, saved, damage, killed, totalRealDamage = 0, totalPointsDestroyed = 0;
  let pointsPerWound = target.cost / target.wounds;
  let unitCost = unit.cpm * unit.number;
  unit.weapons.forEach((weapon) => {
    console.log(` - With ${weapon.name}`);
    unitCost += (unit.number * weapon.cost);
    let ws = weapon.both ? unit.ws + 1 : unit.ws;
    weapon.profiles.forEach((profile) => {
      if (weapon.profiles.length > 1) console.log(`  - ${profile.name} profile:`);
      let numShots =
        typeof profile.shots == "string"
          ? parseAndRollDice(profile.shots)
          : profile.shots;
      let shots = unit.number * numShots;
      hits = Math.ceil(shots * ((7 - ws) / 6));
      let wc = calcWoundChance(profile.s, target.toughness);
      wounds = Math.ceil(hits * ((7 - wc) / 6));
      let modifiedSave = target.save + profile.ap;
      if (target.invul && target.invul < modifiedSave) {
        modifiedSave = target.invul;
      }
      saved = modifiedSave > 6 ? 0 : Math.ceil(wounds * ((7 - modifiedSave) / 6));
      let unsaved = wounds - saved;
      damage = calculateDamage(profile, wounds - saved);
      killed = Math.min(Math.floor(damage / target.wounds), unsaved);
      // console.log(`     wounds on ${wc}+`);
      console.log(`     ${shots} shots, ${hits} hits, ${wounds} wounds, ${unsaved} unsaved, ${damage} damage`);
      let maxDamage = unsaved * target.wounds;
      totalRealDamage += Math.min(damage, maxDamage);
    });
  });
  totalPointsDestroyed = Math.floor(totalRealDamage * pointsPerWound);
  killed = Math.floor(totalRealDamage / target.wounds);
  let efficiency = totalPointsDestroyed / unitCost;
  console.log(
    `    killing ${killed} ${
      target.name
    }, Efficiency: ${totalPointsDestroyed} points destroyed, ${Math.round(
      efficiency * 100
    )}% ROI`
  );
}

function calcWoundChance(strength, toughness) {
  return strength === toughness
    ? 4
    : strength > toughness
    ? strength >= toughness * 2
      ? 2
      : 3
    : toughness >= strength * 2
    ? 6
    : 5;
}

function calculateDamage(profile, wounds) {
  if (typeof profile.d === "string") {
    return wounds * parseAndRollDice(profile.d);
  } else {
    return wounds * profile.d;
  }
}

function parseAndRollDice(string) {
  let modifier = 0;
  let [numDice, diceSides] = string.split(/d/i);
  numDice = Math.max(numDice, 1);
  if (diceSides.search(/\+/) > -1) {
    let [diceSides, modifier] = diceSides.split(/\+/);
  }

  let avg = (parseInt(diceSides) + 1) / 2;

  return (avg + parseInt(modifier)) * numDice;
}
