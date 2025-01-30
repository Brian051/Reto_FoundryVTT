Hooks.once("init", async() => {

  // Registra la configuración del tipo de daño
  game.settings.register("reflect-damage", "damageType", {
    name: "Tipo de daño",
    hint: "Selecciona el tipo de daño que se reflejará",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "radiant": "Radiant",
      "acid": "Ácido",
      "fire": "Fuego",
      "cold": "Frío",
      "poison": "Veneno",
      "lightning": "Rayos",
      "thunder": "Trueno",
      "force": "Fuerza",
      "necrotic": "Necrótico",
      "psychic": "Psíquico"
    },
    default: "radiant",
  });

  // Registra la configuración de la tirada de dados
  game.settings.register("reflect-damage", "dices", {
    name: "Tirada de dados",
    hint: "Insertar la receta de dados",
    scope: "world",
    config: true,
    type: String,
    default: "1d8",
  });

});

// Hooks.once("init", async() => {
//   console.log("Reflect Damage Module ha sido inicializado.");

//   // Registra la configuración del tipo de daño
//   game.settings.register("reflect-damage", "damageType", {
//     name: "Tipo de daño",
//     hint: "Selecciona el tipo de daño que se reflejará",
//     scope: "world",
//     config: true,
//     type: String,
//     choices: {
//       "radiant": "Radiant",
//       "acid": "Ácido",
//       "fire": "Fuego",
//       "cold": "Frío",
//       "poison": "Veneno",
//       "lightning": "Rayos",
//       "thunder": "Trueno",
//       "force": "Fuerza",
//       "necrotic": "Necrótico",
//       "psychic": "Psíquico"
//     },
//     default: "radiant",
//   });
//   console.log("Configuración 'damageType' registrada.");

//   // Registra la configuración de la tirada de dados
//   game.settings.register("reflect-damage", "dices", {
//     name: "Tirada de dados",
//     hint: "Insertar la receta de dados",
//     scope: "world",
//     config: true,
//     type: String,
//     default: "1d8",
//   });
//   console.log("Configuración 'dices' registrada.");
// });
