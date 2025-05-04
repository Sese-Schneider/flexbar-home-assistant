let configCache = null;
async function getConfig(plugin) {
    if (configCache) {
        return configCache;
    }
    configCache = await plugin.getConfig();
    return configCache;
}

async function connect(config) {
    const url = config.url + "/api/";
    const result = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + config.api_key,
            "Content-Type": "application/json",
        },
    });
    return result;
}

async function toggle(domain, entityId, plugin) {
    const config = await getConfig(plugin);
    const url = config.url + "/api/services/" + domain + "/toggle";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + config.api_key,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            entity_id: entityId,
        }),
    });
    return response;
}

export { connect, toggle };
