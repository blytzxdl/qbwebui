<template>
  <div class="main">
    <!-- 全局信息栏 -->
    <div class="top col">
      <div class="topBar row">
        <!-- 全局信息按钮 -->
        <van-icon name="bar-chart-o" class="globalBtn" @click="showGlobal" />

        <div class="globalState">
          <van-icon name="circle" :color="connectState" />DHT:{{
            globalInfo.dht_nodes
          }}
        </div>
        <!-- 速度 -->
        <div class="col" @click="querySetSpeedLimit">
          <div class="globalUpload row">
            <van-icon name="arrow-up" />{{ globalInfo.up_info_speed }}/s
            <!-- 上传速度限制，不为0时显示 -->
            <div class="limit" v-show="globalInfo.up_rate_limit != '0 Bytes'">
              [{{ globalInfo.up_rate_limit }}/s]
            </div>
          </div>
          <div class="globalDownload row">
            <van-icon name="arrow-down" />{{ globalInfo.dl_info_speed }}/s
            <!-- 下载速度限制，不为0时显示 -->
            <div class="limit" v-show="globalInfo.dl_rate_limit != '0 Bytes'">
              [{{ globalInfo.dl_rate_limit }}/s]
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
          :stateTrans="translation.torrentState"
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
    <van-dialog
      v-model="setSpeedLimit"
      :showCancelButton="true"
      overlay-class="overlay"
      get-container="body"
      @confirm="confirmSetSpeedLimit"
      @cancel="cancelSetSpeedLimit"
    >
      <div class="col speedLimit">
        <div class="row alt">
          <div>切换备用</div>
          <van-switch v-model="speedLimit.alternativeSpeedLimit" />
        </div>
        <div class="row manualSet">
          <div class="speedType">上传</div>
          <van-field
            v-model="speedLimit.upload"
            :formatter="formatter"
            class="manualInput"
            :border="false"
          />
          <div>KiB/s</div>
        </div>
        <van-slider v-model="speedLimit.upload" max="10000" />
        <div class="row manualSet">
          <div class="speedType">下载</div>
          <van-field
            v-model="speedLimit.download"
            :formatter="formatter"
            class="manualInput"
            :border="false"
          />
          <div>KiB/s</div>
        </div>

        <van-slider v-model="speedLimit.download" max="10000" />
      </div>
    </van-dialog>
    <!-- 删除弹窗 -->
    <van-dialog
      v-model="confirmDelete"
      :showCancelButton="true"
      overlay-class="overlay"
      get-container="body"
      @confirm="deleteTorrent"
      @cancel="cancelDelete"
      ><div>确定删除{{ deleteName }}?</div>
      <van-checkbox v-model="deleteFiles" shape="square" class="checkDelete"
        >同时删除文件</van-checkbox
      >
    </van-dialog>
    <!-- 添加种子弹窗 -->
    <van-dialog
      v-model="addTorrents"
      :showCancelButton="true"
      class="addDialog"
      overlay-class="overlay"
      get-container="body"
      @confirm="confirmAdd"
      @cancel="cancelAdd"
    >
      <div class="cell">
        <div class="option">种子链接</div>
        <div class="content">
          <van-field
            v-model="newTorrents.urls"
            rows="1"
            autosize
            type="textarea"
            placeholder="请输入链接，换行分隔"
          />
        </div>
      </div>
      <div class="cell">
        <div class="option">自动管理</div>
        <div class="content">
          <van-switch v-model="newTorrents.autoTMM" size="20" />
        </div>
      </div>
      <div class="cell">
        <div class="option">分类</div>
        <div class="content">
          <el-select
            v-model="newTorrents.category"
            filterable
            allow-create
            placeholder="输入以新建"
          >
            <el-option
              v-for="cate in categories"
              :key="cate.name"
              :label="cate.name"
              :value="cate.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="cell">
        <div class="option">标签</div>
        <div class="content">
          <el-select
            v-model="newTorrents.tags"
            filterable
            allow-create
            placeholder="输入以新建"
          >
            <el-option
              v-for="tag in tags"
              :key="tag.name"
              :label="tag.name"
              :value="tag.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="cell">
        <div class="option">保存路径</div>
        <div class="content">
          <el-select
            v-model="selectPath"
            filterable
            allow-create
            :disabled="newTorrents.autoTMM"
            placeholder="C:/xxx"
          >
            <el-option
              v-for="cate in categories"
              :key="cate.name"
              :label="cate.name"
              :value="cate.name"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="cell">
        <div class="option">延迟下载</div>
        <div class="content">
          <van-switch v-model="newTorrents.paused" size="20" />
        </div>
      </div>
    </van-dialog>
    <!-- 文件管理弹窗 -->
    <van-overlay :show="showInfo.to">
      <fileManager v-if="showInfo.to" :rootPath="showInfo.root" />
    </van-overlay>
    <!-- 视频播放弹窗 -->
    <van-overlay :show="playVideo">
      <videoPlayer v-if="playVideo" />
    </van-overlay>
  </div>
</template>

<script>
import tra from "../../utils/translation.js";
import Card from "./card/index.vue";
import FileManager from "../fileManager";
import VideoPlayer from "../videoPlayer";
import Global from "./global";
import { mapState, mapGetters } from "vuex";
import { Toast } from "vant";
export default {
  name: "torrentsList",
  components: {
    Card,
    Global,
    FileManager,
    VideoPlayer,
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
      setSpeedLimit: false,
      speedLimit: {
        alternativeSpeedLimit: true,
        upload: 0,
        download: 0,
      },
      deleteFiles: false,
      confirmDelete: false,
      addTorrents: false,
      newTorrents: {
        urls: "",
        autoTMM: true,
        category: null,
        tags: "",
        savepath: "",
        paused: true,
      },
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
    //添加种子保存路径
    selectPath: {
      get: function () {
        if (
          this.newTorrents.category && //已设置新建种子分类
          this.categories.find((item) => {
            return item.name == this.newTorrents.category;
          }) && //该分类已存在
          this.newTorrents.autoTMM //已开启自动管理
        ) {
          return this.categories.find((item) => {
            return item.name == this.newTorrents.category;
          }).savePath;
        } else {
          return "";
        }
      },
      set: function (newVal) {
        this.newTorrents.savepath = newVal;
      },
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
      console.log(parseInt(this.globalInfo.dl_rate_limit));
      //初始化速度限制
      this.speedLimit.alternativeSpeedLimit =
        this.globalInfo.use_alt_speed_limits;
      this.speedLimit.upload = parseInt(this.globalInfo.up_rate_limit);
      this.speedLimit.download = parseInt(this.globalInfo.dl_rate_limit);
      this.setSpeedLimit = true;
    },
    //确认设置限速
    confirmSetSpeedLimit() {
      this.$store.dispatch("setSpeedLimit", this.speedLimit);
    },
    //取消设置限速
    cancelSetSpeedLimit() {
      this.setSpeedLimit = false;
    },
    //限速输入框格式化
    formatter(val) {
      return Number(val);
    },
    //删除种子
    deleteTorrent() {
      this.$store.dispatch("deleteTorrent", this.deleteFiles);
    },
    //取消删除
    cancelDelete() {
      this.confirmDelete = false;
    },
    //添加种子弹窗
    queryAdd() {
      this.addTorrents = true;
    },
    //执行添加
    confirmAdd() {
      let result = this.$store.dispatch("addTorrents", this.newTorrents);
      result.then((result) => {
        if (result) {
          this.newTorrents.urls = "";
          this.newTorrents.category = "";
          this.newTorrents.savepath = "";
          this.newTorrents.tags = "";
        } else {
          Toast.fail("添加失败");
        }
      });
    },
    //取消添加
    cancelAdd() {
      this.newTorrents.urls = "";
      this.newTorrents.category = "";
      this.newTorrents.tags = "";
      this.newTorrents.savepath = "";
    },
  },
  mounted() {
    this.$bus.$on("queryDelete", () => {
      this.confirmDelete = true;
    });
    this.$bus.$on("controlInfo", (val) => {
      this.showInfo = val;
    });
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
    .overlay {
      height: calc(100vh - 100px);
      margin-top: 103px;
    }
    .topBar {
      height: 100px;
      flex-grow: 1;
      justify-content: center;
      align-items: center;
      display: flex;
      text-align: center;
      .globalBtn {
        font-size: 62px;
        border: 1px solid black;
      }
      .globalState {
        font-size: 32px;
      }
      div {
        flex-grow: 1;
        font-size: 28px;
        .limit {
          text-align: right;
        }
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
      font-size: 62px;
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