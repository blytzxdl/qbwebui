<template>
  <div class="container0">
    <van-swipe-cell :class="cardClass">
      <!-- <template #left>
      <div class="set" v-if="swipe" @click="null">set</div>
    </template> -->
      <!-- 基础卡片 -->
      <div class="base row">
        <div class="control row">
          <van-icon
            :class="`stateIcon ${allStatus[torrentInfo.state].statusIconColor}`"
            :name="allStatus[torrentInfo.state].icon"
            @click="
              allStatus[torrentInfo.state].click.call(store, torrentInfo.hash)
            "
          />
          <div class="split" v-if="!poster"></div>
        </div>
        <!-- 信息区域 -->
        <div class="info col">
          <div class="container1 row">
            <!-- 缩略图 -->
            <div class="poster" v-if="poster && !swipe"></div>
            <div class="container2 col">
              <!-- 滚动显示名称 -->
              <van-notice-bar
                :scrollable="scroll"
                delay="6"
                :text="torrentInfo.name"
                color="#000"
                background="transparent"
                class="name"
                v-if="swipe"
              >
              </van-notice-bar>
              <div class="name" v-if="!swipe">{{ torrentInfo.name }}</div>
              <!-- 基本信息，状态与分类 -->
              <div class="baseInfo col">
                <div class="row text">
                  <div :class="`row line ${downloadingClass}`">
                    <template v-for="badge in cardBadge">
                      <div
                        :key="badge.name"
                        v-if="badge.show"
                        class="container3"
                      >
                        <div :class="badge.class">
                          <van-icon
                            :name="badge.icon"
                            :color="badge.iconColor"
                            v-if="badge.icon"
                          />
                          {{ badge.content }}
                        </div>
                      </div>
                    </template>
                  </div>

                  <div class="col speed">
                    <div v-if="swipe" class="row">
                      <van-icon name="arrow-up" />
                      <div>{{ torrentInfo.upspeed }}/s</div>
                      <div v-if="(torrentInfo.up_limit != '0 Bytes')&&(torrentInfo.up_limit != -1)">
                        [{{ torrentInfo.up_limit }}/s]
                      </div>
                    </div>
                    <div v-if="swipe" class="row">
                      <van-icon name="arrow-down" />
                      <div>{{ torrentInfo.dlspeed }}/s</div>
                      <div v-if="(torrentInfo.dl_limit != '0 Bytes')&&(torrentInfo.dl_limit != -1)">
                        [{{ torrentInfo.dl_limit }}/s]
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 进度条 -->
                <van-progress
                  v-if="swipe"
                  style="position: relative; bottom: 3px"
                  :percentage="torrentInfo.progress"
                  :show-pivot="false"
                  stroke-width="4"
                />
              </div>
            </div>
          </div>
          <!-- 折叠按钮，切换完整信息 -->
          <van-button class="foldButton" @click="changeFold" v-if="!swipe">
            <van-icon name="arrow-down" v-if="fold" />
            <van-icon name="arrow-up" v-if="!fold" />
          </van-button>
        </div>

        <!-- 状态指示条 -->
        <div :class="`statusBar ${statusColor}`" v-show="!swipe"></div>
      </div>

      <!-- 左划删除 -->
      <template #right>
        <!-- <div class="delete" v-if="!swipe" @click="deleteTorrent">删除</div> -->
        <van-icon
          name="delete-o"
          class="delete"
          color="red"
          v-if="!swipe"
          @click="deleteTorrent"
        />
      </template>
    </van-swipe-cell>

    <!-- 完整信息区域 -->
    <div class="infoPage col" v-if="!fold && !swipe">
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
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapState, mapGetters } from "vuex";
export default {
  name: "Card",
  props: ["torrentInfo", "swipe", "files", "infoTrans", "infoCell"],
  data() {
    return {
      trackerData: [],
      poster: false,
      store: this.$store,
    };
  },
  computed: {
    ...mapState(["foldHash"]),
    ...mapGetters(["allStatus"]),
    //折叠状态
    fold() {
      return this.torrentInfo.hash != this.foldHash;
    },
    cardClass() {
      if (this.fold) {
        return "card col";
      } else {
        return "card col unfold";
      }
    },
    downloadingClass() {
      if (this.swipe) {
        return "downloading";
      } else {
        return "";
      }
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
    // showState() {
    //   if (this.torrentInfo.state == "pausedDL") {
    //     return "card col paused";
    //   } else if (this.torrentInfo.state == "downloading") {
    //     return "card col downloading";
    //   } else {
    //     return "card col";
    //   }
    // },
    statusColor() {
      return this.allStatus[this.torrentInfo.state].statusColor;
    },
    cardBadge() {
      let cardBadge = {
        state: {
          content: this.allStatus[this.torrentInfo.state].translate,
          show: !this.swipe,
          icon: "flag-o",
        },
        downloaded: {
          show: Boolean(this.swipe),
          icon: "down",
        },
        size: {
          show: true,
          icon: "points",
        },
        category: {
          show: !this.swipe && this.torrentInfo.category,
          icon: "apps-o",
        },
        ratio: {
          show: !this.swipe,
          icon: "cluster-o",
        },
        upspeed: {
          content: `${this.torrentInfo.upspeed}/s`,
          show: !this.swipe && this.torrentInfo.upspeed != "0 Bytes",
          icon: "arrow-up",
        },
        tags: {
          show: !this.swipe && this.torrentInfo.tags,
          icon: "label-o",
        },
      };
      for (const badge in cardBadge) {
        cardBadge[badge].name = badge;
        if (!cardBadge[badge].content) {
          cardBadge[badge].content = this.torrentInfo[badge];
        }
        cardBadge[badge].class = `cardBadge ${badge}`;
        cardBadge[badge].iconColor = "#808080";
      }
      return cardBadge;
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
.container0 {
  margin: 0 10px;
  .card {
    min-height: 180px;
    background-color: #fff;
    margin: 10px 0px 0px 0px;
    // border: 1px solid black;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #d6d6d6;
    // border-bottom: none;

    .base {
      min-height: 180px;
      display: flex;
      justify-content: space-between;
      .poster {
        min-width: 156px;
        // padding-top: 20px;
        // margin: 12px 12px 0 12px;
        // background-color: red;
        border: 1px solid gray;
        border-radius: 12px;
      }
      .info {
        flex-grow: 1;
        width: 100px;
        // margin-right: 12px;
        .container1 {
          flex-grow: 1;
          padding: 12px 0 0 0;
        }
        .container2 {
          width: 100px;
          flex-grow: 1;
          padding: 0 12px;
          /deep/.name {
            padding: 4px 8px 2px 8px;
            font-size: 30px;
            line-height: 1.5;
            overflow-wrap: break-word;
            border-bottom: 1px solid rgb(214, 214, 214);
            .van-ellipsis {
              overflow: visible;
            }
          }
          .baseInfo {
            min-height: 120px;
            flex-grow: 1;
            justify-content: space-between;
            font-size: 26px;
            .text {
              flex-grow: 1;
              display: flex;
              justify-content: space-between;
              padding: 10px 10px;
              .line {
                display: flex;
                flex-flow: wrap;
                flex-grow: 1;
                justify-content: space-between;
                .container3 {
                  display: flex;
                  align-items: center;
                  .cardBadge {
                    display: flex;
                    align-items: center;
                    flex-grow: 1;
                    height: 30px;
                    margin: 0 20px;
                  }
                }
              }
              .speed {
                margin: 0 0 0 20px;
                justify-content: space-evenly;
              }
              .downloading {
                flex-direction: column;
                justify-content: space-evenly;
              }
            }
          }
        }
        .foldButton {
          height: 12px;
          // border-top: 1px solid rgb(173, 171, 171);
          border: none;
          // background-color: #808080;
        }
      }
      .control {
        min-width: 30px;
        // border-right: 1px solid rgb(214, 214, 214);
        align-items: center;
        justify-content: center;
        .split {
          background-color: rgb(214, 214, 214);
          height: 80%;
          width: 1px;
        }
        .paused {
          border: 1px solid #fa8072;
          .stateIcon {
            color: #fa8072;
          }
        }
        .downloading {
          border: 1px solid #427337;
          .stateIcon {
            color: #427337;
          }
        }
      }
      .statusBar {
        min-width: 10px;
      }
      .statusBar-color-inactive {
        background-color: gray;
      }
      .statusIcon-color-inactive {
        color: gray;
      }
      .statusBar-color-active {
        background-color: skyblue;
      }
      .statusIcon-color-active {
        color: skyblue;
      }
      .statusBar-color-done {
        background-color: rgb(74, 190, 74);
      }
      .statusIcon-color-done {
        color: rgb(74, 190, 74);
      }
      .statusBar-color-error {
        background-color: red;
      }
      .statusIcon-color-error {
        color: red;
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
  }
  .unfold {
    border-radius: 12px 12px 0 0;
  }
  .infoPage {
    height: 500px;
    border-radius: 12px;
    flex-grow: 1;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .cellList {
      overflow-y: scroll;
      border-radius: 0 0 12px 12px;
      // margin: 0 10px;
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
</style>