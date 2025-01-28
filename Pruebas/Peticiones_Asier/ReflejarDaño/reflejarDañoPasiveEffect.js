//----- Script de daño reflejado con Malla de Espinas como efecto pasivo -----

Hooks.on("midi-qol.DamageRollComplete", async (workflow) => {
    const attacker = workflow?.actor; // Actor que realiza el ataque
    const attackerName = attacker?.name; // Nombre del atacante
    const damageTotal = workflow.damageTotal; // Daño total calculado
  
    // Verifica si el ataque tiene al menos un objetivo
    const targets = workflow?.targets;
    if (targets && targets.size > 0) {
        for (const target of targets) {
            console.log(`${attackerName} ha atacado a ${target.name}, infligiendo ${damageTotal} puntos de daño.`);
            ui.notifications.info(`${attackerName} ha atacado a ${target.name}, infligiendo ${damageTotal} puntos de daño.`);
  
            // Verifica si el objetivo tiene el Active Effect "Malla de Espinas"
            const hasEffect = target.actor.effects.some(effect => effect.label === "Malla de Espinas");
            if (hasEffect) {
                console.log(`${target.name} tiene MallaDeEspinas. Se refleja el daño.`);
  
                // Realiza una tirada de dados para calcular el daño reflejado
                const roll = await new Roll("1d8").roll({ async: true });
                const reflexDamage = roll.total;
  
                console.log(`Daño reflejado: ${reflexDamage}`);
  
                // Obtén los puntos de vida actuales del atacante
                const currentHp = attacker.system.attributes.hp.value;
  
                // Verificar si currentHp es válido
                if (currentHp === undefined || isNaN(currentHp)) {
                    console.error("No se puede acceder o no es un valor válido de puntos de vida.");
                    return;
                }
  
                // Actualiza los puntos de vida del atacante
                await attacker.update({
                    "system.attributes.hp.value": currentHp - reflexDamage
                });
  
                console.log(`${attackerName} recibe ${reflexDamage} puntos de daño reflejado. Puntos de vida actualizados: ${currentHp - reflexDamage}`);
  
                // Muestra un mensaje en el chat
                ChatMessage.create({
                    content: `${target.name} refleja ${reflexDamage} puntos de daño a ${attackerName} con MallaDeEspinas.`,
                    speaker: { alias: target.name },
                });
            }
        }
    } else {
        console.log("No hay objetivos para este ataque.");
    }
  });
  