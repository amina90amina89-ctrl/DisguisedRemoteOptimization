import { SlashCommandBuilder } from "discord.js";

export const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("التحقق من حالة البوت")
  .toJSON();

export async function handlePingCommand(interaction) {
  const latency = Math.max(0, Date.now() - interaction.createdTimestamp);
  await interaction.reply(`البوت يعمل بنجاح. زمن الاستجابة: ${latency}ms`);
}