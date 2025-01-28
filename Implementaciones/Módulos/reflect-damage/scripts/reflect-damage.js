//----- Script de daño reflejado con tipo de daño -----//

Hooks.on("midi-qol.DamageRollComplete", async (workflow) => {
    const attacker = workflow?.actor; // Actor que realiza el ataque
    const attackerName = attacker?.name; // Nombre del atacante
    const damageTotal = workflow.damageTotal; // Daño total calculado
  
    console.log("Atacante:", attacker);
    console.log("Daño total:", damageTotal);
  
    // Verifica si el ataque tiene al menos un objetivo
    const targets = workflow?.targets;
    if (targets && targets.size > 0) {
      for (const target of targets) {
        console.log(`Objetivo: ${target.name}`);
        console.log("Efectos del objetivo:", target.actor.effects);
  
        // Verifica si el objetivo tiene el Active Effect "Malla de Espinas"
        const hasEffect = target.actor.effects.some(effect => effect.label === "MallaDeEspinas");
        if (hasEffect) {
          console.log(`${target.name} tiene MallaDeEspinas. Se refleja el daño.`);
  
          // Configura el tipo de daño reflejado
          const damageType = "radiant"; // Cambia "radiant" por cualquier otro tipo de daño (ej. "necrotic", "fire", etc.)
  
          // Realiza una tirada de dados para calcular el daño reflejado
          const roll = await new Roll("1d8").roll({ async: true });
          const reflexDamage = roll.total;
  
          console.log(`Daño reflejado (${damageType}): ${reflexDamage}`);
  
          // Envía el daño reflejado al atacante como un nuevo daño de tipo específico
          new MidiQOL.DamageOnlyWorkflow(
            target.actor, // Actor que refleja el daño
            target.token, // Token del actor que refleja el daño
            reflexDamage, // Cantidad de daño reflejado
            damageType,   // Tipo de daño
            [attacker.token], // Objetivo del daño reflejado (el atacante)
            roll, // Tirada asociada al daño
            {
              flavor: `${target.name} refleja el daño (${damageType}) a ${attackerName} con Malla de Espinas.`,
              itemCardId: "new",
            }
          );
  
          console.log(`${attackerName} recibe ${reflexDamage} puntos de daño (${damageType}).`);
        }
      }
    } else {
      console.log("No hay objetivos para este ataque.");
    }
  });
  