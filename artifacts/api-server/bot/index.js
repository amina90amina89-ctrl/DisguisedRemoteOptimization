import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { commands, handleCommand } from "./commands/index.js";

const token = process.env.DISCORD_TOKEN?.trim();

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

export function createDiscordBot({ logger = console } = {}) {
  if (!token) {
    return {
      async start() {
        logger.warn(
          "متغير البيئة DISCORD_TOKEN غير مضبوط؛ سيتم تشغيل خادم الصحة فقط.",
        );
        return false;
      },
      async stop() {},
    };
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    try {
      const rest = new REST({ version: "10" }).setToken(token);
      await rest.put(Routes.applicationCommands(readyClient.user.id), {
        body: commands,
      });

      logger.info(
        { bot: readyClient.user.tag },
        "تم تسجيل دخول Xevora System وأصبح البوت متصلًا.",
      );
      logger.info("تم تسجيل أوامر البوت بنجاح.");
    } catch (error) {
      logger.error(
        { error: errorMessage(error) },
        "تعذر تسجيل أوامر Discord.",
      );
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    try {
      await handleCommand(interaction);
    } catch (error) {
      logger.error(
        { error: errorMessage(error), command: interaction.commandName },
        "حدث خطأ أثناء تنفيذ أمر Discord.",
      );

      const reply = {
        content: "حدث خطأ غير متوقع أثناء تنفيذ الأمر.",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply).catch(() => undefined);
      } else {
        await interaction.reply(reply).catch(() => undefined);
      }
    }
  });

  client.on(Events.Error, (error) => {
    logger.error(
      { error: errorMessage(error) },
      "حدث خطأ في اتصال Discord.",
    );
  });

  client.on(Events.Warn, (message) => {
    logger.warn(`تحذير من Discord: ${message}`);
  });

  return {
    async start() {
      try {
        await client.login(token);
        return true;
      } catch (error) {
        logger.error(
          { error: errorMessage(error) },
          "تعذر تسجيل دخول Xevora System إلى Discord.",
        );
        throw error;
      }
    },
    async stop(reason = "إيقاف الخدمة") {
      logger.info(`جارٍ إيقاف اتصال Discord: ${reason}.`);
      client.destroy();
    },
  };
}