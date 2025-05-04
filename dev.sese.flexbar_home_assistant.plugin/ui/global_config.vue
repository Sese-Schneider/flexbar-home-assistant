<template>
    <v-container>
        <v-card prepend-icon="mdi-pencil" title="Home Assistant">
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="modelValue.config.url"
                            label="Home Assistant URL"
                            outlined
                            hide-details
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                            v-model="modelValue.config.api_key"
                            label="API KEY"
                            outlined
                            hide-details
                            type="password"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-icon :color="isConnected ? 'success' : 'error'">{{
                    isConnected ? "mdi-link" : "mdi-link-off"
                }}</v-icon>
                <span class="ml-2">{{
                    isConnected ? "Connected" : "Disconnected"
                }}</span>
                <v-spacer></v-spacer>
                <v-btn variant="text" icon @click="saveConfig">
                    <v-icon>mdi-check-circle-outline</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: {
        /**
         *
         * {
         *    "uuid": "<Your Plugin UUID>",
         *    "cid": "<Your Plugin UUID>.<Config Page Name>",
         *    "manifest": <Your Plugin Manifest>,
         *    "config": {}, // Config loadded from local file
         * }
         */
        modelValue: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isConnected: false,
        };
    },
    methods: {
        saveConfig() {
            this.$fd.setConfig(this.modelValue.config);
            this.$fd.showSnackbarMessage("success", "Config updated");
            this.testConnection();
        },
        async testConnection() {
            if (
                !this.modelValue.config.url ||
                !this.modelValue.config.api_key
            ) {
                this.isConnected = false;
                return;
            }

            try {
                const response = await this.$fd.sendToBackend({
                    data: "test-connection",
                    config: this.modelValue.config,
                });

                this.isConnected = response.success;
                this.$fd.info("Connection test result:", this.isConnected);
            } catch (error) {
                this.isConnected = false;
                this.$fd.error("Connection test failed:", error);
            }
        },
    },
    mounted() {
        this.testConnection();
    },
};
</script>

<style scoped></style>
