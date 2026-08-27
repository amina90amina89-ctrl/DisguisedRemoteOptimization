import { handlePingCommand, pingCommand } from "./ping.js";

export const commands = [pingCommand];

const handlers = new Map([["ping", handlePingCommand]]);

export async function handleCommand(interaction) {
  const handler = handlers.get(interaction.commandName);

  if (!handler) {
    await interaction.reply({
      content: "هذا الأمر غير متاح حاليًا.",
      ephemeral: true,
    });
    return;
  }

  await handler(interaction);
}