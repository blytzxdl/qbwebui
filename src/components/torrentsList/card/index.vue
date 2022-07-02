<template>
  <van-swipe-cell class="card col">
    <!-- 基础卡片 -->
    <div class="base row">
      <!-- 开始/暂停按钮 -->
      <div class="control col">
        <van-icon
          :name="icon[torrentInfo.state].show"
          @click="icon[torrentInfo.state].click()"
        />
      </div>
      <!-- 信息区域 -->
      <div class="info col">
        <!-- 滚动显示名称 -->
        <van-notice-bar
          :scrollable="scroll"
          delay="3"
          :text="torrentInfo.name"
          color="#000"
          background="transparent"
          class="name"
        >
        </van-notice-bar>

        <!-- 基本信息，状态与分类 -->
        <div class="baseInfo col">
          <div class="row" id="text">
            <div v-if="!swipe">{{ stateTrans[torrentInfo.state] }}</div>
            <div v-if="!swipe">
              <van-icon name="cluster-o" />{{ torrentInfo.ratio }}
            </div>
            <div><van-icon name="apps-o" />{{ torrentInfo.category }}</div>
            <div v-if="swipe">
              <van-icon name="arrow-down" />{{ torrentInfo.dlspeed }}
            </div>
            <div v-if="swipe">
              <van-icon name="arrow-up" />{{ torrentInfo.upspeed }}
            </div>
          </div>
          <!-- 进度条 -->
          <van-progress
            v-if="swipe"
            style="position: relative; bottom: 3px"
            :percentage="torrentInfo.progress"
            :show-pivot="false"
            stroke-width="2"
          />
        </div>
        <!-- 折叠按钮，切换完整信息 -->
        <van-button class="foldButton" @click="changeFold" v-if="!swipe">
          <van-icon name="arrow-down" v-if="fold" />
          <van-icon name="arrow-up" v-if="!fold" />
        </van-button>
      </div>
    </div>

    <!-- 完整信息区域 -->
    <van-swipe class="infoPage col" v-if="!fold">
      <van-swipe-item class="col"
        ><div class="pageName">信息</div>
        <van-cell-group class="cellList col" :border="false">
          <!-- 将基本信息以单元格显示，hash与磁力链接以图标显示，点击复制 -->
          <van-cell
            class="infoCell"
            v-for="(cell, index) in infoCell"
            :key="index"
            :title="infoTrans[cell]"
            :border="true"
          >
            {{ filterLink(cell) }}
            <van-icon
              v-if="isLink(cell)"
              name="eye-o"
              @click="copyLink(torrentInfo[cell])"
            />
            <!-- </template> -->
          </van-cell>
        </van-cell-group>
      </van-swipe-item>
      <!-- <van-swipe-item class="col"
        ><div class="pageName">种子信息</div></van-swipe-item
      >
      <van-swipe-item class="col"
        ><div class="pageName">Tracker</div>
        <el-table :data="trackerData">
          <el-table-column prop="tier" label="层级" width="50">
          </el-table-column>
          <el-table-column prop="url" label="URL"> </el-table-column>
          <el-table-column prop="status" label="状态"> </el-table-column>
          <el-table-column prop="num_peers" label="用户"> </el-table-column>
          <el-table-column prop="num_peers" label="做种"> </el-table-column>
          <el-table-column prop="num_leeches" label="下载"> </el-table-column>
          <el-table-column prop="num_downloaded" label="完成"></el-table-column>
          <el-table-column prop="msg" label="消息">
          </el-table-column> </el-table
      ></van-swipe-item>
      <van-swipe-item class="col"
        ><div class="pageName">用户</div></van-swipe-item
      > -->
      <van-swipe-item class="col"
        ><div class="pageName">内容</div>
        <el-tree :data="files"></el-tree>
      </van-swipe-item>
    </van-swipe>
    <!-- 左划删除 -->
    <template #right>
      <div class="delete" v-if="!swipe" @click="deleteTorrent">删除</div>
    </template>
  </van-swipe-cell>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "Card",
  props: [
    "torrentInfo",
    "swipe",
    "files",
    "stateTrans",
    "infoTrans",
    "infoCell",
  ],
  data() {
    return {
      fold: true,
      trackerData: [],
    };
  },
  computed: {
    scroll() {
      return this.torrentInfo.name.length > 40 && this.fold;
    },
    icon() {
      let dispatch = this.$store.dispatch;
      let hash = this.torrentInfo.hash;
      return {
        downloading: {
          show: "pause-circle-o",
          click: () => {
            dispatch("setPause", hash);
          },
        },
        pausedDL: {
          show: "play-circle-o",
          click() {
            dispatch("setResume", hash);
          },
        },
        error: { show: "warning-o", click: null },
        missingFiles: { show: "warning-o", click: null },
        uploading: { show: "upgrade", click: null },
        pausedUP: { show: "more-o", click: null },
        queuedUP: { show: "more-o", click: null },
        stalledUP: { show: "upgrade", click: null },
        checkingUP: { show: "more-o", click: null },
        forcedUP: { show: "upgrade", click: null },
        allocating: { show: "more-o", click: null },
        metaDL: { show: "more-o", click: null },
        queuedDL: { show: "more-o", click: null },
        stalledDL: { show: "more-o", click: null },
        checkingDL: { show: "more-o", click: null },
        forcedDL: { show: "more-o", click: null },
        checkingResumeData: { show: "more-o", click: null },
        moving: { show: "more-o", click: null },
        unknown: { show: "more-o", click: null },
      };
    },
    // infoPage() {
    //   return {
    //     trans: {
    //       pageName: "传输信息",
    //     },
    //     tor: {
    //       pageName: "种子信息",
    //       added_on: this.added_on,
    //     },
    //     tracker: {
    //       pageName: "Tracker",
    //     },
    //     user: {
    //       pageName: "用户",
    //     },
    //     content: {
    //       pageName: "内容",
    //     },
    //   };
    // },
  },
  methods: {
    //切换完整信息
    changeFold() {
      this.fold = !this.fold;
      this.$store.dispatch("getFiles", this.torrentInfo.hash);
    },
    filterLink(val) {
      if (this.isLink(val)) {
        return null;
      } else {
        return this.torrentInfo[val].toString();
      }
    },
    isLink(val) {
      if (val == "infohash_v1" || val == "infohash_v2" || val == "magnet_uri") {
        return true;
      }
      return null;
    },
    copyLink(val) {
      this.$copyText(val);
      Toast(`已复制到剪贴板`);
    },
    deleteTorrent() {
      this.$bus.$emit("queryDelete");
      this.$store.commit("QUERYDELETE", {
        name: this.torrentInfo.name,
        hash: this.torrentInfo.hash,
      });
      // this.$store.dispatch('deleteTorrent',this.torrentInfo.hash)
    },
    startTorrent() {
      this.$store.dispatch("setResume", this.torrentInfo.hash);
    },
    pauseTorrent() {
      this.$store.dispatch("setPause", this.torrentInfo.hash);
    },
    dispatchClick(name) {
      this.$store.dispatch(name, this.torrentInfo.hash);
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  min-height: 180px;
  background-color: #fff;
  margin: 20px 10px;
  border: 1px solid black;
  .base {
    .info {
      flex-grow: 1;
      /deep/.name {
        padding: 4px 8px 2px 8px;
        font-size: 80%;
        width: 560px;
        border-bottom: 1px solid black;
        .van-ellipsis {
          overflow: visible;
        }
      }
      .baseInfo {
        flex-grow: 1;
        justify-content: space-between;
        font-size: 26px;
        #text {
          justify-content: space-between;
          flex-grow: 1;
          display: flex;
          padding: 15px 0;
          div {
            width: 200px;
            text-align: center;
          }
        }
      }
      .foldButton {
        height: 20px;
        border-top: 1px solid black;
      }
    }
    .control {
      min-width: 30px;
      height: 180px;
      border-right: 1px solid black;
      justify-content: center;
    }
  }
  .delete {
    width: 60px;
    height: 100%;
    border-left: 1px solid red;
    color: red;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .infoPage {
    height: 500px;
    border-top: 1px solid black;
    flex-grow: 1;
    text-align: center;
    div {
      overflow: scroll;
    }
    .pageName {
      line-height: 1.5;
      border-bottom: 1px solid black;
    }
    .cellList {
      overflow: scroll;
      margin: 0 10px;
      .infoCell {
        font-size: 32px;
      }
      /deep/ .van-cell {
        overflow: visible;
        line-height: 1.5;
        justify-content: space-between;
        // border-bottom: 1px solid black;
        .van-cell__title {
          max-width: 200px;
        }
      }
    }
  }
}
</style>