<template>
  <div class="main">
    <!-- 全局信息栏 -->
    <div class="top col">
      <div class="topBar row">
        <!-- 全局信息按钮 -->
        <van-icon name="bar-chart-o" class="globalBtn" @click="showGlobal" />
        <div class="col state">
          <div class="globalState">
            <van-icon name="circle" :color="connectState" />DHT:{{
              globalInfo.dht_nodes
            }}
          </div>
          <div :class="`fileServer ${fileServerClass}`" @click="openFSSettings">
            <van-icon name="desktop-o" />FileServer
          </div>
        </div>
        <!-- 速度 -->
        <div class="col speed" @click="querySetSpeedLimit">
          <div class="row upload">
            <div class="globalUpload row">
              <van-icon name="arrow-up" />{{ globalInfo.up_info_speed }}/s
            </div>
            <!-- 上传速度限制，不为0时显示 -->
            <div class="limit" v-show="globalInfo.up_rate_limit != 0">
              [{{ showSpeedLimit.up_rate_limit }}/s]
            </div>
          </div>
          <div class="row download">
            <div class="globalDownload row">
              <van-icon name="arrow-down" />{{ globalInfo.dl_info_speed }}/s
            </div>
            <!-- 下载速度限制，不为0时显示 -->
            <div class="limit" v-show="globalInfo.dl_rate_limit != 0">
              [{{ showSpeedLimit.dl_rate_limit }}/s]
            </div>
          </div>
        </div>
      </div>
      <!-- 全局信息界面 -->
      <van-overlay :show="global" class-name="overlay">
        <Global v-if="global"></Global>
      </van-overlay>
    </div>
    <!-- 轮播下载中的种子 -->
    <div class="carousel">
      <van-swipe
        v-show="downloading.length != 0"
        class="my-swipe"
        :autoplay="5000"
      >
        <van-swipe-item v-for="item in downloading" :key="item.hash">
          <Card :torrentInfo="item" :swipe="true" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 所有种子,无限滚动 -->
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <div v-for="(item, index) in itemInfo" :key="item.hash">
        <Card
          v-if="index < showNum"
          :torrentInfo="item"
          :files="files"
          :infoTrans="translation.info"
          :infoCell="infoCell"
        />
      </div>
    </van-list>
    <!-- 底部导航 -->
    <div class="bottom row" size="100%" v-show="!global">
      <van-icon name="add-o" class="setting" @click="queryAdd" />
      <van-search
        v-model="search"
        show-action
        placeholder="空格分隔关键词(支持名称,分类,标签)"
        input-align="center"
        @search="onSearch"
        @cancel="onCancel"
        class="search"
      />
    </div>
    <!-- 限速弹窗 -->
    <van-overlay :show="setSpeedLimit">
      <SetSpeedLimit v-if="setSpeedLimit"></SetSpeedLimit>
    </van-overlay>
    <!-- 删除弹窗 -->
    <van-overlay :show="confirmDelete">
      <Overlay
        v-if="confirmDelete"
        :onConfirm="deleteTorrent"
        :onCancel="cancelDelete"
      >
        <div class="queryDelete col">
          <div>确定删除"{{ deleteName }}"?</div>
          <van-checkbox v-model="deleteFiles" shape="square" class="checkDelete"
            >同时删除文件</van-checkbox
          >
        </div>
      </Overlay>
    </van-overlay>
    <!-- 添加种子弹窗 -->
    <van-overlay :show="showAddTorrents" :lock-scroll="false">
      <AddTorrents v-if="showAddTorrents"></AddTorrents>
    </van-overlay>
    <!-- 文件管理弹窗 -->
    <van-overlay :show="showInfo.to" :lock-scroll="false">
      <FileManager v-if="showInfo.to" :rootPath="showInfo.root" />
    </van-overlay>
    <!-- 视频播放弹窗 -->
    <van-overlay :show="playVideo">
      <VideoPlayer v-if="playVideo" />
    </van-overlay>
    <!-- FileServer控制弹窗 -->
    <van-overlay :show="showFSSettings" :lock-scroll="false">
      <FileServerController v-if="showFSSettings" />
    </van-overlay>
  </div>
</template>

<script>
import tra from "../../utils/translation.js";
import Card from "./card/index.vue";
import FileManager from "../fileManager";
import VideoPlayer from "../videoPlayer";
import FileServerController from "@/components/fileServerController";
import AddTorrents from "@/components/addTorrents";
import SetSpeedLimit from "@/components/setSpeedLimit";
import Overlay from "@/components/overlay";
import Global from "./global";
import { mapState, mapGetters } from "vuex";
import renderSize from "@/utils/renderSize";
export default {
  name: "torrentsList",
  components: {
    Card,
    Global,
    FileManager,
    VideoPlayer,
    FileServerController,
    AddTorrents,
    SetSpeedLimit,
    Overlay,
  },
  data() {
    return {
      loading: false,
      finished: false,
      global: false,
      showFilter: "all",
      showNum: 40, //卡片显示数量
      search: "",
      language: "chs",
      tra, //翻译源
      showInfo: { to: false },
      deleteFiles: false,
      confirmDelete: false,
      infoCell: [
        "name",
        "size",
        "category",
        "tags",
        "auto_tmm",
        "content_path",
        "amount_left",
        "infohash_v1",
        "infohash_v2",
        "added_on",
        "availability",
        "completed",
        "completion_on",
        "dl_limit",
        "dlspeed",
        "download_path",
        "downloaded",
        "downloaded_session",
        "eta",
        "f_l_piece_prio",
        "force_start",
        "last_activity",
        "magnet_uri",
        "max_ratio",
        "max_seeding_time",
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
        "state",
        "super_seeding",
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
    ...mapState([
      "itemInfo",
      "globalInfo",
      "files",
      "deleteName",
      "categories",
      "tags",
      "playVideo",
      "fileServerState",
      "showFSSettings",
      "showAddTorrents",
      "setSpeedLimit",
    ]),
    ...mapGetters(["downloading", "trackers"]),
    //筛选设置
    showList() {
      if (this.showFilter == "all") {
        return this.itemInfo;
      } else if (this.showFilter != "all") {
        // return this.itemInfo.filter(i=>i)
      }
    },
    //提取翻译
    translation() {
      return this.tra[this.language];
    },
    //连接状态图标
    connectState() {
      if (this.globalInfo.connection_status == "connected") {
        return "green";
      } else {
        return "red";
      }
    },
    showSpeedLimit() {
      return {
        up_rate_limit: renderSize(this.globalInfo.up_rate_limit),
        dl_rate_limit: renderSize(this.globalInfo.dl_rate_limit),
      };
    },
    fileServerClass() {
      if (this.fileServerState) {
        return "serverOn";
      } else {
        return "";
      }
    },
    limit() {
      return (
        this.globalInfo.up_rate_limit != 0 || this.globalInfo.dl_rate_limit != 0
      );
    },
  },
  methods: {
    //展开全局信息界面
    showGlobal() {
      this.global = !this.global;
    },
    //搜索参数处理
    onSearch(input) {
      let searchParams = input.split(" ");
      this.$store.commit("SETFILTER", { mode: "search", par: searchParams });
    },
    //取消搜索
    onCancel() {
      this.$store.commit("CLEARFILTER");
    },
    //同步数据
    sync() {
      this.$store.dispatch("getMaindata");
    },
    //无限滚动判定
    onLoad() {
      setTimeout(() => {
        this.showNum += 20;
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.showNum >= this.itemInfo.length) {
          this.finished = true;
        }
      }, 300);
    },
    //限速弹窗
    querySetSpeedLimit() {
      this.$store.commit("CONTROLSETSPEEDLIMIT", true);
    },
    //删除种子
    deleteTorrent() {
      this.$store
        .dispatch("deleteTorrent", this.deleteFiles)
        .then((result) => {
          this.confirmDelete = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //取消删除
    cancelDelete() {
      this.confirmDelete = false;
    },
    //添加种子弹窗
    queryAdd() {
      this.$store.commit("CONTROLADDTORRENTS", true);
    },
    openFSSettings() {
      if (this.fileServerState) {
        this.$store.dispatch("checkFileServer").then((result) => {
          this.$store.commit("CONTROLFSSETTINGS", true);
        }).catch((err) => {
        });
      }
    },
  },
  mounted() {
    this.$bus.$on("queryDelete", () => {
      this.confirmDelete = true;
    });
    this.$bus.$on("controlInfo", (val) => {
      if (this.files) {
        this.showInfo = val;
      }
    });
    this.$store.dispatch("checkFileServer");
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
    border-bottom: 1px solid #d8d8d8;
    padding: 0 10px;
    background-color: #fff;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .overlay {
      height: calc(100vh - 100px);
      margin-top: 103px;
    }
    .topBar {
      height: 100px;
      flex-grow: 1;
      justify-content: space-between;
      align-items: center;
      display: flex;
      text-align: center;
      font-size: 28px;
      .globalBtn {
        font-size: 62px;
        color: #505050;
        // border: 1px solid #d8d8d8;
      }
      .state,
      .speed {
        height: 100%;
        justify-content: space-evenly;
        .globalUpload,
        .globalDownload {
          min-width: 200px;
        }
      }
      .limit {
        text-align: right;
      }
      .fileServer {
        font-style: italic;
        color: red;
      }
      .serverOn {
        color: green;
      }
    }
  }
  .bottom {
    border-top: 1px solid #949494;
    border-radius: 12px 12px 0 0;
    min-height: 100px;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    .setting {
      font-size: 52px;
      color: #505050;
    }
    .search {
      width: 650px;
      height: 60px;
      padding: 0;
      border: 1px solid #d8d8d8;
      border-radius: 12px;
      .van-search__content {
        padding: 0;
        background-color: #fff;
        border: none;
        .van-field {
          font-size: 26px;
        }
      }
    }
  }
  .queryDelete {
    height: 100%;
    justify-content: space-evenly;
    align-items: center;
    font-size: 36px;
    .checkDelete {
      line-height: 1.5;
      font-size: 36px;
      // font-size: inherit;
      /deep/.van-checkbox__icon {
        font-size: inherit;
      }
    }
  }
}
</style>