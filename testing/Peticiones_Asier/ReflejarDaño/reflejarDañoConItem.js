Hooks.once("ready", () => {
  Hooks.on("midi-qol.DamageRollComplete", (workflow) => {
    console.log("He entrado en la función");

    const attacker = workflow?.actor; // Actor que realiza el ataque
    const attackerName = attacker?.name; // Nombre del atacante
    const damageTotal = workflow.damageTotal; // Daño total calculado
    let reflexDamage;

    // Verifica si el ataque tiene al menos un objetivo
    const targets = workflow?.targets;
    if (targets && targets.size > 0) {
      targets.forEach(target => {
        console.log(`${attackerName} ha atacado a ${target.name}, infligiendo ${damageTotal} puntos de daño.`);
        ui.notifications.info(`${attackerName} ha atacado a ${target.name}, infligiendo ${damageTotal} puntos de daño.`);
        
        // Verifica si el objetivo tiene el item de armadura reflejante
        const itemName = "MallaDeEspinas"; // Cambia este nombre por el de tu armadura
        const hasItem = target.actor.items.some(item => item.name === itemName);

        if (hasItem) {
          // Si el objetivo tiene el item de armadura reflejante, aplica el daño reflejo al atacante
          reflexDamage = damageTotal / 2;  // La cantidad de daño reflejado (en este caso, la mitad del daño)

          console.log(`Daño reflejo activado, ${attackerName} recibe ${reflexDamage} puntos de daño.`);

          // Obtener los puntos de vida actuales del atacante
          const attackerCurrentHp = attacker.system.attributes.hp.value;
          if (attackerCurrentHp === undefined || isNaN(attackerCurrentHp)) {
            console.error("No se puede acceder o no es un valor válido de puntos de vida del atacante.");
            return;
          }

          // Actualizar los puntos de vida del atacante (aplicar el daño reflejado)
          attacker.update({
            "system.attributes.hp.value": attackerCurrentHp - reflexDamage
          });

          console.log(`Puntos de vida actualizados del atacante (${attackerName}): ${attackerCurrentHp - reflexDamage}`);
        } else {
          console.log("No lleva el item");
        }
      });
    } else {
      console.log("No hay objetivos para este ataque.");
    }

    console.log("He llegado al final de la función");
  });
});
