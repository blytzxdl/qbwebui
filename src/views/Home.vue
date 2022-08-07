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
.van-dialog {
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 0;
  height: auto;
  min-height: 400px;
  max-height: 1000px;
  width: 600px;
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
    height: 100px;
    // flex-grow: 1;
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
.addDialog {
  height: auto;
  min-height: 800px;
  max-height: 1400px;
  .van-dialog__content {
    text-align: left;
    display: flex;
    .cell {
      margin: 10px 0;
      width: 600px;
      font-size: 36px;
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      align-items: center;
      padding: 0 20px;
      .option {
        margin-left: 20px;
      }
      .content {
        width: 400px;
        margin-right: 10px;
        display: flex;
        justify-content: flex-end;
        .van-cell,
        .van-field {
          border: 1px solid black;
          min-height: 64px;
          max-height: 600px;
          overflow: scroll;
          .van-field__body {
            min-height: 60px;
            font-size: 24px;
          }
        }
        .el-select {
          width: 100%;
          .el-input {
            .el-input__inner {
              height: 60px !important;
              font-size: 30px;
            }
          }
        }
      }
    }
  }
}
.speedLimit {
  width: 500px;
  height: 250px;
  display: flex;
  justify-content: space-evenly;
  .alt {
    justify-content: space-between;
  }
  .manualSet {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .speedType {
      width: 120px;
      text-align: left;
    }
    .manualInput {
      width: 150px;
      font-size: 36px;
      .van-field__control {
        text-align: center;
      }
    }
  }
}
.el-select-dropdown__item {
  font-size: 30px;
}
</style>