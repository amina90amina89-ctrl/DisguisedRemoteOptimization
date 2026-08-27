import app from "./app";
import { logger } from "./lib/logger";
import { createDiscordBot } from "../bot/index.js";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error("متغير البيئة PORT مطلوب ولم يتم توفيره.");
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`قيمة PORT غير صالحة: "${rawPort}"`);
}

const discordBot = createDiscordBot({ logger });
const server = app.listen(port, (err) => {
  if (err) {
    logger.error({ error: err }, "تعذر تشغيل خادم الصحة.");
    process.exit(1);
  }

  logger.info({ port }, "خادم الصحة يعمل بنجاح.");
});

void discordBot.start().catch(() => {
  process.exit(1);
});

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info(`تم استقبال ${signal}؛ جارٍ إيقاف الخدمات بأمان.`);

  await discordBot.stop(signal);

  await new Promise<void>((resolve) => {
    server.close((error) => {
      if (error) {
        logger.error({ error }, "تعذر إغلاق خادم الصحة.");
      }
      resolve();
    });
  });

  logger.info("اكتمل الإيقاف الآمن.");
}

process.once("SIGINT", () => {
  void shutdown("SIGINT").finally(() => process.exit(0));
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM").finally(() => process.exit(0));
});
