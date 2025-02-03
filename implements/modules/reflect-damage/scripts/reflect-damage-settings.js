//reflect-damage-settings.js

Hooks.once("init", async () => {
  //------------ Registra la configuración del tipo de daño ----------------------
    game.settings.register("reflect-damage", "damageType", {
      name: "Tipo de daño",
      hint: "Selecciona el tipo de daño que se reflejará",
      scope: "world",
      config: true,
      type: String,
      choices: {
        radiant: "Radiant",
        acid: "Ácido",
        fire: "Fuego",
        cold: "Frío",
        poison: "Veneno",
        lightning: "Rayos",
        thunder: "Trueno",
        force: "Fuerza",
        necrotic: "Necrótico",
        psychic: "Psíquico",
      },
      default: "radiant",
      restricted: true,
    });
  

  //------------ Registra la configuración de la tirada de dados -----------------
    game.settings.register("reflect-damage", "dices", {
      name: "Tirada de dados",
      hint: "Inserta la fórmula de dados (ej: 1d8)",
      scope: "world",
      config: true,
      type: String,
      default: "1d8",
    });
  

  //------------ Registra la configuración del nombre del efecto -----------------
    game.settings.register("reflect-damage", "spikedArmorName", {
      name: "Nombre del efecto de daño reflejado",
      hint: "Nombre del efecto pasivo",
      scope: "world",
      config: true,
      type: String,
      default: "MallaDeEspinas",
      restricted: true,

      onChange: async (newValue) => {
        // Obtener el nombre del efecto desde la configuración actual
        const oldEffectName = game.settings.get(
          "reflect-damage",
          "spikedArmorName"
        );

        // Buscar todos los actores en la escena con el efecto basado en la flag personalizada
        const tokensOnScene = canvas.tokens.placeables
          .map((token) => token.actor)
          .filter((actor) => actor);

        for (const actor of tokensOnScene) {
          try {
            // Buscar el efecto con la flag personalizada
            const effect = actor.effects.find(
              (e) => e.flags["reflect-damage"]?.spikedArmorFlag === true
            );

            if (effect) {
              // Eliminar el efecto antiguo
              console.log(
                `Eliminando efecto antiguo "${oldEffectName}" de ${actor.name}`
              );
              await effect.delete();
            }

            // Crear un nuevo efecto con el nombre actualizado
            console.log(`Añadiendo nuevo efecto "${newValue}" a ${actor.name}`);
            await actor.createEmbeddedDocuments("ActiveEffect", [
              {
                label: newValue,
                icon: "modules/reflect-damage/icons/Malla_De_Espinas.jpg", // Ajusta el icono según lo necesario
                changes: [],
                duration: {},
                flags: {
                  "reflect-damage": {
                    spikedArmorFlag: true, // Flag personalizada
                  },
                },
              },
            ]);
          } catch (error) {
            console.error(`Error al actualizar efecto para ${actor.name}:`, error);
          }
        }

        // Actualizar el nombre de la configuración global
        game.settings.set("reflect-damage", "spikedArmorName", newValue);
      },
    });
  
});

// Registrar el efecto "MallaDeEspinas" al inicializar el actor
Hooks.on("ready", async () => {
  const actor = game.actors.get("ACTOR_ID"); // Cambia esto por el ID del actor o hazlo dinámico
  if (actor) {
    try {
      // Crear el efecto "MallaDeEspinas" si no existe
      const existingEffect = actor.effects.find(
        (e) => e.flags["reflect-damage"]?.spikedArmorFlag === true
      );
      if (!existingEffect) {
        await actor.createEmbeddedDocuments("ActiveEffect", [
          {
            label: "MallaDeEspinas",
            icon: "modules/reflect-damage/icons/Malla_De_Espinas.jpg",
            changes: [],
            duration: { rounds: 10 },
            flags: {
              "reflect-damage": {
                spikedArmorFlag: true,
              },
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error al registrar el efecto 'MallaDeEspinas':", error);
    }
  }
});
