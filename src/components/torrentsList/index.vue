<template>
  <div class="main">
    <div class="top col">
      <div class="topBar row">
        <!-- 全局信息按钮 -->
        <van-icon name="bar-chart-o" class="globalBtn" @click="showGlobal" />
        <div class="globalDownload row">
          <van-icon name="arrow-down" />{{ globalInfo.dl_info_speed }}/s
          <!-- 下载速度限制，不为0时显示 -->
          <div v-show="globalInfo.dl_rate_limit != '0 Bytes'">
            [{{ globalInfo.dl_rate_limit }}/s]
          </div>
        </div>
        <div class="globalUpload row">
          <van-icon name="arrow-up" />{{ globalInfo.up_info_speed }}
          <!-- 上传速度限制，不为0时显示 -->
          <div v-show="globalInfo.up_rate_limit != '0 Bytes'">
            [{{ globalInfo.up_rate_limit }}/s]
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
        <van-swipe-item v-for="item in downloading" :key="item.hash">
          <Card :torrentInfo="item" :swipe="true" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 所有种子 -->
    <ul class="list" v-show="!global">
      <Card
        v-for="(item, index) in itemInfo"
        v-show="index < showNum"
        :key="item.hash"
        :torrentInfo="item"
        :files="files"
        :stateTrans="translation.torrentState"
        :infoTrans="translation.info"
        :infoCell='infoCell'
      />
    </ul>
    <!-- 底部导航 -->
    <div class="bottom row" size="100%" v-show="!global">
      <van-icon name="add-o" class="setting" @click="sync" />
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
import tra from "../../utils/translation.json";
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
      showFilter: "all",
      showNum: 40, //卡片显示数量
      search: "",
      language: "chs",
      tra,
      infoCell: [
        "added_on",
        "amount_left",
        "auto_tmm",
        "availability",
        "category",
        "completed",
        "completion_on",
        "content_path",
        "dl_limit",
        "dlspeed",
        "download_path",
        "downloaded",
        "downloaded_session",
        "eta",
        "f_l_piece_prio",
        "force_start",
        "infohash_v1",
        "infohash_v2",
        "last_activity",
        "magnet_uri",
        "max_ratio",
        "max_seeding_time",
        "name",
        "num_complete",
        "num_incomplete",
        "num_leechs",
        "num_seeds",
        "priority",
        "progress",
        "ratio",
        "ratio_limit",
        "save_path",
        "seeding_time",
        "seeding_time_limit",
        "seen_complete",
        "seq_dl",
        "size",
        "state",
        "super_seeding",
        "tags",
        "time_active",
        "total_size",
        "tracker",
        "trackers_count",
        "up_limit",
        "uploaded",
        "uploaded_session",
        "upspeed",
      ],
    };
  },
  computed: {
    ...mapState({
      itemInfo: (state) => state.item.itemInfo,
      globalInfo: (state) => state.item.globalInfo,
      files: (state) => state.item.files,
    }),
    ...mapGetters(["downloading", "categories", "tags", "trackers"]),
    //筛选设置
    showList() {
      if (this.showFilter == "all") {
        return this.itemInfo;
      } else if (this.showFilter != "all") {
        // return this.itemInfo.filter(i=>i)
      }
    },
    translation() {
      return this.tra[this.language];
    },
  },
  methods: {
    showGlobal() {
      this.global = !this.global;
    },
    onSearch() {},
    onCancel() {},
    sync() {
      this.$store.dispatch("getMaindata");
    },
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