<template>
  <torrents-list></torrents-list>
</template>

<script>
import torrentsList from "@/components/torrentsList/index.vue";
export default {
  components: { torrentsList },
  name: "home",
  mounted() {
    this.$store.dispatch("getMaindata");
  },
};
</script>

<style>
</style>