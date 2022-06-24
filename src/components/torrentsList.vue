<template>
  <div class="main">
    <div class="top">
      <div class="globalInfo" v-show="showGlobal"></div>
    </div>
    <ul class="list">
      <li
        v-show="!showGlobal"
        v-for="(item, index) in itemInfo"
        :key="item.hash"
        class="card"
      >
        <div class="name">
          {{ item.name }}
        </div>
      </li>
    </ul>
    <div class="bottom" v-show="!showGlobal"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "torrentsList",
  data() {
    return {
      showGlobal: false,
    };
  },
  computed: {
    ...mapState({
      itemInfo: (state) => state.item.itemInfo,
    }),
  },
  mounted() {
    this.$store.dispatch("getMaindata");
  },
};
</script>

<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  .list {
    background-color: blue;
    flex-grow: 1;
    overflow: scroll;
    .card {
      height: 180px;
      background-color: #fff;
      margin: 4px 0;
      .name {
        font-size: 36px;
      }
    }
  }
  .top {
    background-color: #bfa;
    min-height: 100px;
    .globalInfo {
      height: 100vh;
    }
  }
  .bottom {
    background-color: #bfa;
    min-height: 100px;
  }
}
</style>