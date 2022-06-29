<template>
  <van-swipe-cell class="card col">
    <!-- 基础卡片 -->
    <div class="base row">
      <!-- 开始/暂停按钮 -->
      <div class="control col">
        <van-icon name="pause-circle-o" v-if="swipe" />
        <van-icon name="play-circle-o" v-if="!swipe" />
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
          <van-cell
            class="infoCell"
            v-for="(cell, index) in infoCell"
            :key="index"
            :title="infoTrans[cell]"
            :border="true"
          >
            {{ filterLink(cell) }}
            <!-- <template  #right-icon > -->
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
      > -->
      <van-swipe-item class="col"
        ><div class="pageName">Tracker</div></van-swipe-item
      >
      <van-swipe-item class="col"
        ><div class="pageName">用户</div></van-swipe-item
      >
      <van-swipe-item class="col"
        ><div class="pageName">内容</div>
        <el-tree :data="files"></el-tree>
      </van-swipe-item>
    </van-swipe>
    <!-- 左划删除 -->
    <template #right>
      <div class="delete" v-if="!swipe">删除</div>
    </template>
  </van-swipe-cell>
</template>

<script>
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
    };
  },
  computed: {
    scroll() {
      return this.torrentInfo.name.length > 40 && this.fold;
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
      console.log(val);
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
            width: 160px;
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