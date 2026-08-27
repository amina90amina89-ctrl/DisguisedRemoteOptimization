export interface DiscordBot {
  start(): Promise<boolean>;
  stop(reason?: string): Promise<void>;
}

export function createDiscordBot(options?: {
  logger?: {
    info: (objectOrMessage: unknown, message?: string) => void;
    warn: (objectOrMessage: unknown, message?: string) => void;
    error: (objectOrMessage: unknown, message?: string) => void;
  };
}): DiscordBot;