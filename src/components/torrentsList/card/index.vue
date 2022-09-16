<template>
  <van-swipe-cell :class="showState">
        <!-- <template #left>
      <div class="set" v-if="swipe" @click="null">set</div>
    </template> -->
    <!-- 基础卡片 -->
    <div class="base row">
      <!-- 信息区域 -->
      <div class="info col">
        <div class="container1 row">
          <!-- 缩略图 -->
          <div class="poster" v-if="poster"></div>
          <div class="container2 col">
            <!-- 滚动显示名称 -->
            <van-notice-bar
              :scrollable="scroll"
              delay="6"
              :text="torrentInfo.name"
              color="#000"
              background="transparent"
              class="name"
            >
            </van-notice-bar>
            <!-- 基本信息，状态与分类 -->
            <div class="baseInfo col">
              <div class="row" id="text">
                <div v-if="!swipe" class="state">
                  {{ stateTrans[torrentInfo.state] }}
                </div>
                <div v-if="!swipe">
                  <van-icon name="cluster-o" />{{ torrentInfo.ratio }}
                </div>
                <div><van-icon name="apps-o" />{{ torrentInfo.category }}</div>
                <div v-if="swipe">
                  <van-icon name="arrow-down" />{{ torrentInfo.dlspeed }}/s
                </div>
                <div v-if="swipe">
                  <van-icon name="arrow-up" />{{ torrentInfo.upspeed }}/s
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
          </div>
        </div>
        <!-- 折叠按钮，切换完整信息 -->
        <van-button class="foldButton" @click="changeFold">
          <van-icon name="arrow-down" v-if="fold" />
          <van-icon name="arrow-up" v-if="!fold" />
        </van-button>
      </div>
      <!-- 开始/暂停按钮 -->
      <div :class="`statusBar ${statusColor}`" v-show="!swipe">
        <!-- <van-icon
          class="stateIcon"
          :name="icon[torrentInfo.state].show"
          @click="icon[torrentInfo.state].click()"
        /> -->
      </div>
    </div>

    <!-- 完整信息区域 -->
    <div class="infoPage col" v-if="!fold">
      <van-cell-group class="cellList col" :border="false">
        <van-cell
          class="infoCell"
          title="查看内容"
          @click="
            $bus.$emit('controlInfo', { to: true, root: torrentInfo.save_path })
          "
          ><van-icon name="more-o" color="#0dbc79"
        /></van-cell>
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
        </van-cell>
      </van-cell-group>
    </div>
    <!-- 左划删除 -->
    <template #right>
      <div class="delete" v-if="!swipe" @click="deleteTorrent">删除</div>
    </template>
  </van-swipe-cell>
</template>

<script>
import { Toast } from "vant";
import { mapState, mapGetters } from "vuex";
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
      trackerData: [],
      poster:false
    };
  },
  computed: {
    ...mapState(["foldHash"]),
    ...mapGetters(["allStatus"]),
    //折叠状态
    fold() {
      return this.torrentInfo.hash != this.foldHash;
    },
    //是否滚动显示名称
    scroll() {
      return this.torrentInfo.name.length > 40 && this.fold;
    },
    //图标及对应操作
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
    //根据种子状态动态切换样式
    showState() {
      if (this.torrentInfo.state == "pausedDL") {
        return "card col paused";
      } else if (this.torrentInfo.state == "downloading") {
        return "card col downloading";
      } else {
        return "card col";
      }
    },
    statusColor() {
      return this.allStatus[this.torrentInfo.state].statusColor;
    },
  },
  methods: {
    //切换完整信息
    changeFold() {
      this.$store.commit("SETFOLDHASH", this.torrentInfo.hash);
    },
    //过滤hash及磁链
    filterLink(val) {
      if (this.isLink(val)) {
        return null;
      } else {
        return this.torrentInfo[val].toString();
      }
    },
    //判断hash及磁链
    isLink(val) {
      if (val == "infohash_v1" || val == "infohash_v2" || val == "magnet_uri") {
        return true;
      }
      return null;
    },
    //复制hash及磁链
    copyLink(val) {
      this.$copyText(val);
      Toast(`已复制到剪贴板`);
    },
    //删除种子
    deleteTorrent() {
      this.$bus.$emit("queryDelete");
      this.$store.commit("QUERYDELETE", {
        name: this.torrentInfo.name,
        hash: this.torrentInfo.hash,
      });
    },
    //开始种子
    startTorrent() {
      this.$store.dispatch("setResume", this.torrentInfo.hash);
    },
    //暂停种子
    pauseTorrent() {
      this.$store.dispatch("setPause", this.torrentInfo.hash);
    },
  },
  mounted() {
    // this.allStatus.downloading.trans();
  },
};
</script>

<style lang="less" scoped>
.card {
  min-height: 180px;
  background-color: #fff;
  margin: 20px 10px;
  // border: 1px solid black;
  border-radius: 12px;
  .base {
    .poster {
      width: 156px;
      // padding-top: 20px;
      // margin: 12px 12px 0 12px;
      // background-color: red;
      border: 1px solid gray;
      border-radius: 12px;
    }
    .info {
      flex-grow: 1;
      .container1 {
        flex-grow: 1;
        padding: 12px 0 0 12px;
      }
      .container2 {
        flex-grow: 1;
        padding: 0 12px;
      }
      /deep/.name {
        padding: 4px 8px 2px 8px;
        margin-right: 100px;
        font-size: 80%;
        // width: 80%;
        border-bottom: 1px solid rgb(214, 214, 214);
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
            // width: 200px;
            text-align: center;
          }
        }
      }
      .foldButton {
        height: 12px;
        // border-top: 1px solid rgb(173, 171, 171);
        border: none;
      }
    }
    // .control {
    //   min-width: 30px;
    //   height: 180px;
    //   border-right: 1px solid black;
    //   justify-content: center;
    // }
    .statusBar {
      width: 12px;
      height: 180px;
    }
    .statusBar-color-inactive {
      background-color: gray;
    }
    .statusBar-color-active {
      background-color: skyblue;
    }
    .statusBar-color-done {
      background-color: rgb(74, 190, 74);
    }
    .statusBar-color-error {
      background-color: red;
    }
  }
  .delete {
    width: 60px;
    height: 100%;
    // border-left: 1px solid red;
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
        .van-cell__title {
          max-width: 200px;
        }
      }
    }
  }
}
.paused {
  border: 1px solid #fa8072;
  .state,
  .stateIcon {
    color: #fa8072;
  }
}
.downloading {
  border: 1px solid #427337;
  .state,
  .stateIcon {
    color: #427337;
  }
}
</style>