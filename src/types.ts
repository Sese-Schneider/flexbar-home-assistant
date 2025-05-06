import { plugin } from '@eniac/flexdesigner';

export type Config = {
    url: string;
    api_key: string;
};

export type Plugin = typeof plugin;
