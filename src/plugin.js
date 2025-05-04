const {
    plugin,
    logger,
    pluginPath,
    resourcesPath,
} = require("@eniac/flexdesigner");

// Store key data
const keyData = {};

/**
 * Called when current active window changes
 * {
 *    "status": "changed",
 *    "oldWin": OldWindow,
 *    "newWin": NewWindow
 * }
 */
plugin.on("system.actwin", (payload) => {
    logger.info("Active window changed:", payload);
});

/**
 * Called when received message from UI send by this.$fd.sendToBackend
 * @param {object} payload message sent from UI
 */
plugin.on("ui.message", async (payload) => {
    logger.info("Received message from UI:", payload);
    if (payload.data === "test-connection") {
        try {
            // send an API request to the Home Assistant server
            const response = await fetch(payload.config.url + "/api/", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + payload.config.api_key,
                    "Content-Type": "application/json",
                },
            });
            return { success: response.ok };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
});

/**
 * Called when device status changes
 * @param {object} devices device status data
 * [
 *  {
 *    serialNumber: '',
 *    deviceData: {
 *       platform: '',
 *       profileVersion: '',
 *       firmwareVersion: '',
 *       deviceName: '',
 *       displayName: ''
 *    }
 *  }
 * ]
 */
plugin.on("device.status", (devices) => {
    logger.info("Device status changed:", devices);
});

/**
 * Called when a plugin key is loaded
 * @param {Object} payload alive key data
 * {
 *  serialNumber: '',
 *  keys: []
 * }
 */
plugin.on("plugin.alive", (payload) => {
    logger.info("Plugin alive:", payload);
    for (let key of payload.keys) {
        keyData[key.uid] = key;
        if (key.cid === "dev.sese.flexbar_home_assistant.counter") {
            keyData[key.uid].counter = parseInt(key.data.rangeMin);
            key.style.showIcon = false;
            key.style.showTitle = true;
            key.title = "Click Me!";
            plugin.draw(payload.serialNumber, key, "draw");
        }
    }
});

/**
 * Called when user interacts with a key
 * @param {object} payload key data
 * {
 *  serialNumber,
 *  data
 * }
 */
plugin.on("plugin.data", (payload) => {
    logger.info("Received plugin.data:", payload);
    const data = payload.data;
    if (data.key.cid === "dev.sese.flexbar_home_assistant.counter") {
        const key = data.key;
        key.style.showIcon = false;
        key.style.showTitle = true;
        keyData[key.uid].counter++;
        if (keyData[key.uid].counter > parseInt(key.data.rangeMax)) {
            keyData[key.uid].counter = parseInt(key.data.rangeMin);
        }
        key.title = keyData[key.uid].counter.toString();
        plugin.draw(payload.serialNumber, key, "draw");
    }
});

// Connect to flexdesigner and start the plugin
plugin.start();
