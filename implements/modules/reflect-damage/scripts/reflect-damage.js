//reflect-damage.js

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
  const attacker = workflow?.actor;
  const attackerName = attacker?.name;
  const damageType = game.settings.get("reflect-damage", "damageType");
  const spikedArmorName = game.settings.get("reflect-damage", "spikedArmorName");

  const targets = workflow?.targets;
  if (!targets || targets.size === 0) {
    console.log("No hay objetivos para este ataque.");
    return;
  }

  const promises = targets.map(async (target) => {
    try {
      console.log(`Objetivo: ${target.name}`);
      console.log("Efectos del objetivo:", target.actor.effects);

      // Verificar si el objetivo tiene el efecto basado en la clase
      const hasEffect = target.actor.effects.some(
        (effect) => effect.name === spikedArmorName
      );
      if (!hasEffect) return;

      //sólo ataques a melee
      if (!workflow.item || workflow.item.system.actionType !== "mwak") return;

      console.log(`${target.name} tiene ${spikedArmorName}. Se refleja el daño.`);

      // Tirada de daño reflejado
      const myRollSettingValue =
        game.settings.get("reflect-damage", "dices") || "1d8";
      const roll = await new Roll(myRollSettingValue).roll({ async: true });
      const reflexDamage = roll.total;

      // Resistencias del atacante
      const attackerResistances = attacker.system.traits?.dr?.value || new Set();
      console.log(
        `Resistencias de ${attackerName}:`,
        attackerResistances
      );

      let finalDamage = reflexDamage;
      let resistanceText = "";

      if (attackerResistances.has(damageType)) {
        console.log(
          `${attackerName} es resistente a ${damageType}. Daño reducido a la mitad.`
        );
        finalDamage = Math.floor(reflexDamage / 2);
        resistanceText = `Daño reducido a ${finalDamage}.`;
      } else {
        console.log(
          `${attackerName} NO es resistente a ${damageType}. Daño total aplicado.`
        );
      }

      await attacker.applyDamage(finalDamage);

      // Llenar datos para la plantilla del chat
      const templateData = {
        attackerName,
        reflexDamage,
        damageType,
        targetName: target.name,
        rollFormula: roll.formula,
        finalDamage,
        resistanceText,
        spikedArmorName
      };

      const htmlContent = await renderTemplate(
        `modules/reflect-damage/templates/messageTemplate.html`,
        templateData
      );

      // Crea un mensaje en el chat
      await ChatMessage.create({
        user: game.user.id,
        speaker: { actor: attacker, token: attacker?.token },
        content: htmlContent,
      });
    } catch (error) {
      console.error(`Error procesando objetivo ${target.name}:`, error);
    }
  });

  await Promise.all(promises);

});
