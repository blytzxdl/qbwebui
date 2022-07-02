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

<style lang='less'>
.van-dialog {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0;
  width: 600px;
  height: 400px;
  .van-dialog__content {
    flex-grow: 4;
    font-size: 36px;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    .checkDelete {
      height: 40px;
      .van-checkbox__icon {
        font-size: inherit;
      }
    }
  }
  .van-dialog__footer {
    flex-grow: 1;
    align-items: center;
    border-top: 1px solid black;
    button {
      height: 100%;
      font-size: 36px;
      &:nth-child(1) {
        border-right: 1px solid black;
      }
    }
  }
}
.overlay {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>