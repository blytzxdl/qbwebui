<template>
  <torrents-list></torrents-list>
</template>

<script>
import torrentsList from "@/components/torrentsList/index.vue";
export default {
  components: { torrentsList },
  name: "home",
  methods: {
    //同步数据
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

<style lang='less'>

// .van-overlay {
//   background-color: rgba(255, 255, 255, 0.5);
// }


.el-select-dropdown__item {
  font-size: 30px;
}
</style>