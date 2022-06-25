<template>
  <div class="main">
    <div class="top">
      <van-button class="globalBtn" @click="showGlobal"></van-button>
      <div class="globalInfo" v-show="global"></div>
    </div>
    <div class="carousel" v-show="!global">
      <van-swipe
        v-show="downloading.length != 0"
        class="my-swipe"
        :autoplay="false"
      >
        <van-swipe-item
          v-for="(item, index) in downloading"
          :key="item.hash"
        >
          <Card :torrentInfo="item" :swipe='true'/>
        </van-swipe-item>
      </van-swipe>
    </div>
    <ul class="list" v-show="!global">
      <Card
        v-show="index<showLength"
        v-for="(item, index) in itemInfo"
        :key="item.hash"
        :torrentInfo="item"
      />
    </ul>
    <div class="bottom" v-show="!global"></div>
  </div>
</template>

<script>
import Card from "./card/index.vue";
import { mapState, mapGetters } from "vuex";
export default {
  name: "torrentsList",
  components: {
    Card,
  },
  data() {
    return {
      global: false,
      showLength:20
    };
  },
  computed: {
    ...mapState({
      itemInfo: (state) => state.item.itemInfo,
    }),
    ...mapGetters(["downloading"]),
  },
  methods:{
    showGlobal(){
      this.global=!this.global
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  .carousel {
    // height: 100px;
  }
  .list {
    background-color: blue;
    flex-grow: 1;
    overflow-x: hidden;
  }
  .top {
    background-color: #bfa;
    min-height: 100px;
    .globalInfo {
      height: 100vh;
    }
    .globalBtn{
      background-color: red;
    }
  }
  .bottom {
    background-color: #bfa;
    min-height: 100px;
  }
}
</style>