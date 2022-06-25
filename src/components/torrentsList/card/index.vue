<template>
  <div class="card">
    <div class="base">
      <div class="control"></div>
      <div class="info">
        <div class="name">
          {{ torrentInfo.name }}
        </div>
        <div class="baseInfo">
            <span>{{torrentInfo.state}}</span>
            <span>{{torrentInfo.category}}</span>
        </div>
        <div class="expandInfo" v-if="swipe"></div>
        <van-button class="foldButton" @click="changeFold" v-if="!swipe"></van-button>
      </div>
      <div class="delete"></div>
    </div>
    <div class="allInfo" v-if="!fold"></div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["torrentInfo", "swipe"],
  data() {
    return {
      fold: true,
    };
  },
  methods: {
    changeFold() {
      this.fold = !this.fold;
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  min-height: 180px;
  background-color: #fff;
  margin: 20px 10px;
  display: flex;
  flex-direction: column;
  .base {
    display: flex;
    .info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 30px;
        width: 360px;
      }
      .baseInfo {
        flex-grow: 1;
        background-color: #bfa;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 26px;

      }
      .expandInfo{
        flex-grow: 1;
        background-color: rgb(151, 248, 175);
      }
      .foldButton {
        height: 20px;
        background-color: red;
        border: none;
      }
    }
    .control {
      min-width: 30px;
      height: 180px;
      background-color: red;
    }
    .delete {
      min-width: 10px;
      height: 180px;
      background-color: red;
    }
  }
  .allInfo {
    height: 200px;
    background-color: #bfa;
  }
}
</style>