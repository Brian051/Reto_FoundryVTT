async function loadTemplate(path, data) {
  const response = await fetch(path);
  let template = await response.text();
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, "g");
    template = template.replace(regex, data[key]);
  }
  return template;
}

Hooks.on("midi-qol.DamageRollComplete", async (workflow) => {
  const attacker = workflow?.actor; // Actor que realiza el ataque
  const attackerName = attacker?.name; // Nombre del atacante
  const damageType = game.settings.get("reflect-damage", "damageType"); // Tipo de daño


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
        const myRollSettingValue = game.settings.get('reflect-damage', 'dices') || 'default';
        const roll = await new Roll(myRollSettingValue).roll({ async: true });
        const reflexDamage = roll.total;

        // Aplica el daño reflejado al atacante
        await attacker.applyDamage(reflexDamage);

        // Cargar el HTML desde la plantilla
        const htmlContent = await loadTemplate(
          `modules/reflect-damage/templates/messageTemplate.html`,
          {
            attackerName: attackerName,
            reflexDamage: reflexDamage,
            damageType: damageType,
            targetName: target.name,
            rollFormula: roll.formula,
          }
        );

        // Crea mensaje en el chat
        await ChatMessage.create({
          user: game.user.id,
          speaker: { actor: attacker, token: attacker?.token },
          content: htmlContent,
        });
      }
    }
  } else {
    console.log("No hay objetivos para este ataque.");
  }
});
