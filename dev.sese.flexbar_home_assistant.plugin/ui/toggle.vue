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
        return {};
    },
    methods: {},
    mounted() {},
};
</script>

<style scoped></style>
