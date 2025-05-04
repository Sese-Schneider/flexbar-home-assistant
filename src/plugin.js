const {
    plugin,
    logger,
    pluginPath,
    resourcesPath,
} = require("@eniac/flexdesigner");

const { connect, toggle } = require("./api");

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
            const response = await connect(payload.config);
            return { success: response.ok };
        } catch (error) {
            logger.error("Error connecting to Home Assistant:", error);
            return { success: false };
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
        if (key.cid === "dev.sese.flexbar_home_assistant.toggle") {
            // plugin.draw(payload.serialNumber, key, "draw");
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
    if (data.key.cid === "dev.sese.flexbar_home_assistant.toggle") {
        const key = data.key;

        const domain = key.data.entityId.split(".")[0];

        toggle(domain, key.data.entityId, plugin);

        // plugin.draw(payload.serialNumber, key, "draw");
    }
});

// Connect to flexdesigner and start the plugin
plugin.start();
