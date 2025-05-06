import { Config, Plugin } from './types';

let configCache: Config | null = null;
async function getConfig(plugin: Plugin): Promise<Config> {
    if (configCache) return configCache;
    configCache = (await plugin.getConfig()) as Config;
    return configCache;
}

async function connect(config: Config) {
    const url = `${config.url}/api/`;
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${config.api_key}`,
            'Content-Type': 'application/json',
        },
    });
    return result;
}

async function toggle(domain: string, entityId: string, plugin: Plugin) {
    const config = await getConfig(plugin);
    const url = `${config.url}/api/services/${domain}/toggle`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.api_key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            entity_id: entityId,
        }),
    });
    return response;
}

export { connect, toggle };
