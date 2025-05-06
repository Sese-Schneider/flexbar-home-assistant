import { logger, plugin } from '@eniac/flexdesigner';

export type Config = {
    url: string;
    api_key: string;
};

export type Plugin = typeof plugin;
export type Logger = typeof logger;

export type Context = {
    logger: Logger;
    plugin: Plugin;
};
