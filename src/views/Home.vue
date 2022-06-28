<template>
  <torrents-list></torrents-list>
</template>

<script>
import torrentsList from "@/components/torrentsList/index.vue";
export default {
  components: { torrentsList },
  name: "home",
  methods: {
    syncData() {
      this.$store.dispatch("getMaindata");
      setInterval(() => {
        this.$store.dispatch("getMaindata");
      }, 2000);
    },
  },
  mounted() {
    this.syncData();
  },
};
</script>

<style>
</style>