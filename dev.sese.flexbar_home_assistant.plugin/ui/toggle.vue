<template>
    <v-container>
        <v-row>
            <v-col cols="6">
                <v-text-field
                    v-model="modelValue.data.entityId"
                    :label="$t('Toggle.UI.entityId')"
                    hide-details
                    outlined
                    class="mx-2"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <v-switch
                    v-model="modelValue.data.syncStyle"
                    :label="$t('Toggle.UI.syncStyle')"
                    hide-details
                    class="mx-2"
                ></v-switch>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },
    emits: ["update:modelValue"],
    data() {
        return {
            syncStyle: false,
        };
    },
    methods: {},
    mounted() {
        // Initialize syncStyle if not present
        if (this.modelValue.data.syncStyle === undefined) {
            this.modelValue.data.syncStyle = false;
        }
    },
};
</script>

<style scoped></style>
