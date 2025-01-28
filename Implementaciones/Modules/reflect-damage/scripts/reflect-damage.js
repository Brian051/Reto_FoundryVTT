//----- Script de daño reflejado con tipo de daño -----//

Hooks.on("midi-qol.DamageRollComplete", async (workflow) => {
  const attacker = workflow?.actor; // Actor que realiza el ataque
  const attackerName = attacker?.name; // Nombre del atacante
  const damageTotal = workflow.damageTotal; // Daño total calculado
  const damageType = game.settings.get("reflect-damage", "damageType"); // Tipo de daño

  console.log("Atacante:", attacker);
  console.log("Daño total:", damageTotal);

  // Verifica si el ataque tiene al menos un objetivo
  const targets = workflow?.targets;
  if (targets && targets.size > 0) {
    for (const target of targets) {
      console.log(`Objetivo: ${target.name}`);
      console.log("Efectos del objetivo:", target.actor.effects);

      // Verifica si el objetivo tiene el Active Effect "Malla de Espinas"
      const hasEffect = target.actor.effects.some(
        (effect) => effect.label === "MallaDeEspinas"
      );
      if (hasEffect) {
        console.log(`${target.name} tiene MallaDeEspinas. Se refleja el daño.`);

        // Realiza una tirada de dados para calcular el daño reflejado
        const roll = await new Roll("1d8").roll({ async: true });
        const reflexDamage = roll.total;

        console.log(`Daño reflejado (${damageType}): ${reflexDamage}`);

        // Aplica el daño reflejado al atacante
        await attacker.applyDamage(reflexDamage);

        // Muestra el mensaje visualmente enriquecido en el chat para todos los jugadores
        await ChatMessage.create({
          user: game.user.id,
          speaker: { actor: attacker, token: attacker.token },
          content: `
            <div style="padding: 10px; background-color: #34495e; border-radius: 5px; color: white; font-weight: bold;">
              <p><strong>${attackerName}</strong> recibe <strong>${reflexDamage}</strong> puntos de daño reflejado <strong>(${damageType})</strong> de <strong>${target.name}</strong> debido a su <em>"Malla de Espinas"</em>.</p>
              <hr style="border-color: #ecf0f1;">
              <table style="width: 100%; color: white; border-collapse: collapse;">
                <tr style="background-color: #2c3e50;">
                  <th style="padding: 5px; text-align: left;">Detalles</th>
                  <th style="padding: 5px; text-align: left;">Valor</th>
                </tr>
                <tr style="background-color: #34495e;">
                  <td style="padding: 5px;"><strong>Atacante</strong></td>
                  <td style="padding: 5px;">${attackerName}</td>
                </tr>
                <tr style="background-color: #2c3e50;">
                  <td style="padding: 5px;"><strong>Daño Reflejado</strong></td>
                  <td style="padding: 5px;">${reflexDamage}</td>
                </tr>
                <tr style="background-color: #34495e;">
                  <td style="padding: 5px;"><strong>Tipo de Daño</strong></td>
                  <td style="padding: 5px;">${damageType}</td>
                </tr>
                <tr style="background-color: #2c3e50;">
                  <td style="padding: 5px;"><strong>Tirada de Daño</strong></td>
                  <td style="padding: 5px;">${roll.formula} = ${reflexDamage}</td>
                </tr>
              </table>
            </div>
          `,
        });

        console.log(
          `${attackerName} recibe ${reflexDamage} puntos de daño (${damageType}).`
        );
      }
    }
  } else {
    console.log("No hay objetivos para este ataque.");
  }
});