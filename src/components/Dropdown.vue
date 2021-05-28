<template>
    <select id="topics" name="topics" @change="getValue"  v-model="selected">
        <option v-for="(label, index) in labels" :key="index" :value="label">{{label}}</option>
    </select>
</template>

<script>
export default {
    props: ["labels"],
    data: () => ({ selected: "Average Viewers" }),
    methods: {
        getValue(event) {
            this.$emit("change", event.target.value);
        }
    }
}
</script>

<style></style>