Hooks.once("ready", () => {
    // Llama a la función que configurará los ajustes del módulo
    console.log("Reflect Damage Module está listo.");
  
    // Definir la configuración de tipo de daño predeterminado
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

    game.settings.register("reflect-damage", "dices", {
      name: "Tirada de dados",
      hint: "Insertar la receta de dados",
      scope: "world",
      config: true,
      type: String,
      default: "1d8",
    });
  
  });
  