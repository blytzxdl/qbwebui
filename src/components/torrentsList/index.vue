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
        <div class="col">
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
        :autoplay="0"
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
        placeholder="请输入搜索关键词"
        input-align="center"
        @search="onSearch"
        @cancel="onCancel"
        class="search"
      />
    </div>
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
              v-for="cate in tags"
              :key="cate"
              :label="cate"
              :value="cate"
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
              v-for="cate in tags"
              :key="cate"
              :label="tags[cate]"
              :value="tags[cate]"
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
  </div>
</template>

<script>
import tra from "../../utils/translation.json";
import Card from "./card/index.vue";
import Global from "./global";
import { mapState, mapGetters } from "vuex";
import { Toast } from "vant";
export default {
  name: "torrentsList",
  components: {
    Card,
    Global,
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
    ...mapState({
      itemInfo: (state) => state.data.itemInfo,
      globalInfo: (state) => state.data.globalInfo,
      files: (state) => state.data.files,
      deleteName: (state) => state.data.deleteName,
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
    selectPath: {
      get: function () {
        if (
          this.newTorrents.category &&
          this.categories[this.newTorrents.category] &&
          this.newTorrents.autoTMM
        ) {
          return this.categories[this.newTorrents.category].savePath;
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
    onSearch() {},
    onCancel() {},
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
    deleteTorrent() {
      this.$store.dispatch("deleteTorrent", this.deleteFiles);
    },
    cancelDelete() {
      this.confirmDelete = false;
    },
    queryAdd() {
      this.addTorrents = true;
    },
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