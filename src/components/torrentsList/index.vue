<template>
  <div class="main">
    <div class="top col">
      <div class="topBar row">
        <!-- 全局信息按钮 -->
        <van-icon name="bar-chart-o" class="globalBtn" @click="showGlobal" />
        <div class="globalDownload row">
          <van-icon name="arrow-down" />{{ transferInfo.dl_info_speed }}/s
          <!-- 下载速度限制，不为0时显示 -->
          <div v-show="transferInfo.dl_rate_limit != '0 Bytes'">
            [{{ transferInfo.dl_rate_limit }}/s]
          </div>
        </div>
        <div class="globalUpload row">
          <van-icon name="arrow-up" />{{ transferInfo.up_info_speed }}
          <!-- 上传速度限制，不为0时显示 -->
          <div v-show="transferInfo.up_rate_limit != '0 Bytes'">
            [{{ transferInfo.up_rate_limit }}/s]
          </div>
        </div>
      </div>
      <!-- 全局信息界面 -->
      <div class="globalInfo col" v-show="global">
        <div class="infoBox"></div>
        <div class="infoBox"></div>
        <div class="infoBox"></div>
      </div>
    </div>
    <!-- 轮播下载中的种子 -->
    <div class="carousel" v-show="!global">
      <van-swipe
        v-show="downloading.length != 0"
        class="my-swipe"
        :autoplay="0"
      >
        <van-swipe-item v-for="(item, index) in downloading" :key="item.hash">
          <Card :torrentInfo="item" :swipe="true" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 所有种子 -->
    <ul class="list" v-show="!global">
      <Card
        v-show="index < showLength"
        v-for="(item, index) in itemInfo"
        :key="item.hash"
        :torrentInfo="item"
      />
    </ul>
    <!-- 底部导航 -->
    <div class="bottom row" size="100%" v-show="!global">
      <van-icon name="setting-o" class="setting" />
      <van-search
        v-model="search"
        show-action
        placeholder="请输入搜索关键词"
        input-align="center"
        @search="onSearch"
        @cancel="onCancel"
        class="search"
      />
    </div>
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
      showLength: 40,
      search: "",
    };
  },
  computed: {
    ...mapState({
      itemInfo: (state) => state.item.itemInfo,
    }),
    ...mapGetters(["downloading", "transferInfo"]),
  },
  methods: {
    showGlobal() {
      this.global = !this.global;
    },
    onSearch() {},
    onCancel() {},
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
    flex-grow: 1;
    overflow-x: hidden;
  }
  .top {
    min-height: 100px;
    border-bottom: 1px solid black;
    padding: 0 10px;
    .globalInfo {
      height: calc(100vh - 103px);
      border-top: 1px solid black;
      .infoBox {
        flex-grow: 1;
        margin: 10px;
        border: 1px solid black;
      }
    }
    .topBar {
      height: 100px;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      .globalBtn {
        font-size: 60px;
        border: 1px solid black;
      }
      div {
        flex-grow: 1;
        font-size: 29px;
      }
    }
  }
  .bottom {
    border-top: 1px solid black;
    min-height: 100px;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    .setting {
      font-size: 60px;
      border: 1px solid black;
    }
    .search {
      width: 650px;
      height: 60px;
      padding: 0;
      border: 1px solid black;
    }
  }
}
</style>