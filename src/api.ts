import { Config, Context } from './types';

let configCache: Config | null = null;
async function getConfig(context: Context): Promise<Config> {
    if (configCache) return configCache;
    configCache = (await context.plugin.getConfig()) as Config;
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

async function toggle(domain: string, entityId: string, context: Context) {
    const config = await getConfig(context);
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

async function getEntityState(entityId: string, context: Context) {
    const config = await getConfig(context);
    const url = `${config.url}/api/states/${entityId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${config.api_key}`,
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export { connect, getEntityState, toggle };
